const {gql, AuthenticationError, UserInputError} = require("apollo-server-express");
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const cookie = require('cookie');

const saltRounds = 10;

const resolvers = {
    Query:{
        signout: (_, data, {req, res}) => {
            console.log("BEFORE: " + req.session.username)
            req.session.destroy();
            res.setHeader('Set-Cookie', cookie.serialize('username', '', {
                path : '/', 
                maxAge: 60 * 60 * 24 * 7,		  // 1 week in number of seconds
            }));
            console.log("After: " + req.session)
            return "success";
        },
        
        authenticate: (_, date, {req, res}) => {
            if(req.session.username) {
                return "success"
            } else {
                return "failure"
            }
        }
    },

    Mutation: {
        signin: async (_, data, {req, res}) => {
            const username = data.username
            const password = data.password

            try {
                const t = await userModel.findOne({username: username}).exec();
                if(!t) return new UserInputError("Invalid Username");

                const match = await bcrypt.compare(password, t.hashPassword);
                if(!match) return new AuthenticationError("Incorrect Password")

                req.session.username = username;

                console.log(req.session)

                res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                    path : '/', 
                    maxAge: 60 * 60 * 24 * 7
                }));

                return username;
            } catch (err) {
                return new UserInputError("Invalid input");
            }
        },

        signup: async (_, data, {req, res}) => {
            const username = data.username
            const password = data.password

            try {
                const hash = await bcrypt.hash(password, saltRounds)

                const user = await userModel.findOne({username: username}).exec()
                if(user) return new UserInputError("User Already Exists");

                const t = await userModel.insertMany({username: username, hashPassword: hash, salt: saltRounds})

                req.session.username = username
                console.log(req.session)

                res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                    path : '/', 
                    maxAge: 60 * 60 * 24 * 7
                }));

                return username;
            } catch (err) {
                return new UserInputError("Invalid input");
            }
        }
    }
}

module.exports = { resolvers };