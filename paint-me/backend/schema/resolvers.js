const {gql, AuthenticationError, UserInputError} = require("apollo-server-express");
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const drawings = require("../models/privateDrawing");
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

            const drawing = drawings.find({username: req.session.username, public:false}).exec()
            return drawing;
        },

        publicDrawings: async (_, data, {req, res}) => {
            if(!req.session.username) {
                throw new AuthenticationError();
            }

            const drawing = drawings.find({username: req.session.username, public:true}).exec()
            return drawing;
        },
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

        addDrawing: async (_, data, {req, res}) => {
            if(!req.session.username) {
                throw new AuthenticationError()
            }

            const name = data.name;
            const username = req.session.username;
            const path = "";
            const public = data.public;

            const t = await drawings.insertMany({name, username:[username], path, public})

            return t[0]._id
        },

        findRoom: async (_, data, {req, res}) => {
            if(!req.session.username) {
                throw new AuthenticationError();
            }

            const drawing = await drawings.find({_id: data._id, public:true}).exec()
            if(drawing.length > 0) {
                const x = await drawings.updateOne({_id: data._id, public:true}, {$push: {username:req.session.username}}).exec()
                return true;
            } else {
                return false;
            }
        },

        loadImage: async (_, data, {req, res}) => {
            if(!req.session.username) {
                throw new AuthenticationError();
            }

            const drawing = await drawings.find({_id: data._id, public:true}).exec()

            if(drawing.length > 0 && drawing[0].path != "") {
                return true;
            } else {
                return false;
            }
        },

    }
}

module.exports = { resolvers };