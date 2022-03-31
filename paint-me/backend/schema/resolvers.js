const {gql, AuthenticationError, UserInputError} = require("apollo-server-express");
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const privateDrawings = require("../models/privateDrawing");
const cookie = require('cookie');
const validator = require('validator');
const saltRounds = 10;

const resolvers = {
    Query:{
        signout: (_, data, {req, res}) => {
            
            req.session.destroy();
            res.setHeader('Set-Cookie', cookie.serialize('username', '', {
                path : '/', 
                maxAge: 60 * 60 * 24 * 7,		  // 1 week in number of seconds
            }));
            
            return "success";
        },
        
        authenticate: (_, date, {req, res}) => {
            if(req.session.username) {
                return "success"
            } else {
                throw new AuthenticationError();
            }
        },

        privateDrawings: async (_, data, {req, res}) => {
            if(!req.session.username) {
                throw new AuthenticationError();
            }

            const drawings = privateDrawings.find({username: req.session.username}).exec()
            return drawings;
        }
    },

    Mutation: {
        signin: async (_, data, {req, res}) => {
            const username = data.username
            const password = data.password
            if(username !== validator.escape(username)){
                return new UserInputError("Invalid input");
            }else if(password !== validator.escape(password)){
                return new UserInputError("Invalid input");
            }

            try {
                const t = await userModel.findOne({username: username}).exec();
                if(!t) return new UserInputError("Invalid Username");

                const match = await bcrypt.compare(password, t.hashPassword);
                if(!match) return new AuthenticationError("Incorrect Password")

                req.session.username = username;

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

            if(username !== validator.escape(username)){
                return new UserInputError("Invalid input");
            }else if(password !== validator.escape(password)){
                return new UserInputError("Invalid input");
            }

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
        },

        addPrivateDrawing: async (_, data, {req, res}) => {
            if(!req.session.username) {
                throw new AuthenticationError()
            }

            const name = data.name;
            const username = req.session.username;
            const path = "";
            const public = false;

            const t = await privateDrawings.insertMany({name, username, path, public})

            return "success";
        }

    }
}

module.exports = { resolvers };