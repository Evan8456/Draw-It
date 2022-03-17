const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const test = require('dotenv').config();
const mongoose = require('mongoose');
const messageModel = require('./models/message');
const userModel = require('./models/user');
const roomModel = require('./models/room');
const pictureModel = require('./models/picture');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const {typeDefs} = require("./schema/type-defs");
const {resolvers} = require("./schema/resolvers");

  mongoose.connect(process.env.MONGODB_CONNECTION);

  mongoose.connection.once('open', function() { 
    console.log('Connected to the Database.');
  });

  mongoose.connection.on('error', function(error) {
    console.log('Mongoose Connection Error : ' + error);
  });


const app = express();
const router = express.Router();


async function start() {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start()
    
    server.applyMiddleware({ app });
}
start();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cookie = require('cookie');
const session = require('express-session');

 app.use(session({
   secret: 'This is the final project',
   resave: false,
   saveUninitialized: true,
   cookie: {
	   httpOnly: true,
	   secure: true,
	   samesite : 'strict'
 }))

 
var isAuthenticated = function(req, res, next) {
  if (!req.username) return res.status(401).end("access denied");
  next();
};

 app.use(function (req, res, next){
   var cookies = cookie.parse(req.headers.cookie || '');
   console.log(req.session.user);
   req.username =(req.session.user)? req.session.user.username : ''
   console.log("HTTP request", req.username, req.method, req.url, req.body);
   next();
 });

 


  app.get('/signout/',  isAuthenticated,function (req, res, next) {
    req.session.destroy();
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7,		  // 1 week in number of seconds
		  httpOnly: true,
		  secure: true,
		  samesite : 'strict'
	}));
    return res.json({});
    
});



app.post('/signUp/',  function (req, res, next) {
 console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  console.log(username);
  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store the salted hash in the database
    if (err) return res.status(500).end(err);
        password = hash;
        userModel.findOne({username: username}, function(err, user){
            if (err) return res.status(500).end(err);
            if (user) return res.status(409).end("username " + username + " already exists");
            userModel.insertMany({ username:username,hashPassword: hash, salt: saltRounds}, function(err, result){
                if (err) return res.status(500).end(err);
                // initialize cookie
                // gets the update entry returned from callback
                req.session.user = username;
                res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                      path : '/', 
                      maxAge: 60 * 60 * 24 * 7,
					  httpOnly: true,
					  secure: true,
					  samesite : 'strict'
                }));
                return res.json(username);
            });
        });

    });
});

app.post('/login/',  function (req, res, next) {
   
  var username = req.body.username;
    var password = req.body.password;
    console.log(password);
    // retrieve user from the database
    userModel.findOne({username: username}, function(err, user){
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end("access denied");
        bcrypt.compare(password, user.hashPassword, function(err, result) {
            if (err) return res.status(500).end(err);
            if(!result){
                return res.status(401).end("access denied"); 
            }
            // initialize cookie
            req.session.user = user;
            res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                path : '/', 
                maxAge: 60 * 60 * 24 * 7
            }));
            console.log()
            return res.json(username);
        });

        
    });
});






app.listen({ port: 3001 }, () =>
  console.log(`Server running on http://localhost:3001, test queries on http://localhost:3001/graphql`)
  
);