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
var session = require("express-session")({
  secret: process.env.SESSION_SECRET_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    samesite : 'strict'
   }
});

var sharedsession = require("express-socket.io-session");

//DEV ONLY
if(process.env.ENVIRONMENT == "dev") {
  // cors for dev
  const cors = require('cors')
  app.use(cors({
    origin:'http://localhost:3000',
    credentials: true
  }));

  const io = require("socket.io")(3002, {
    cors:{
      origin: ['http://localhost:3000'],
    },
    cookie: true
  })


  io.use(sharedsession(session, {
    autoSave:true
  })); 

  app.use(session);
  
  io.on("connection", socket =>{
    console.log(socket.id)
    socket.on("drawing", (data, room) =>{
      console.log("currently drawing on room: " + room);
      socket.to(room).emit('drawing', data);
      //io.broadcast.emit('test2',param1);
      //socket.to(room);
    })
    socket.on("join-room", (room) =>{
      var rooms = socket.rooms;
      console.log(socket.rooms);
      rooms.forEach(element => {
        console.log(element);
        socket.leave(element);
      });
      socket.join(room);
      console.log(socket.rooms);
    })
  })
  


} else {
  console.log("????")
  app.use(session({
    secret: 'This is the final project',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true,
      samesite : 'strict'
     }
   }));
}
 
var isAuthenticated = function(req, res, next) {
  if (!req.session.username) return res.status(401).end("access denied");
  next();
};

 app.use(function (req, res, next){
   var cookies = cookie.parse(req.headers.cookie || '');
   console.log(req.session.username);
   req.username =(req.session.user)? req.session.user.username : ''
   console.log("HTTP request", req.username, req.method, req.url, req.body);
   next();
 });

 


  app.get('/signout/',  isAuthenticated,function (req, res, next) {
    req.session.destroy();
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7,		  // 1 week in number of seconds
	  }));
    console.log(req.session)
    return res.json({});
    
});



app.post('/signup/',  function (req, res, next) {
  console.log("test");
  var username = req.body.username;
  var password = req.body.password;
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
                req.session.username = username;
                res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                      path : '/', 
                      maxAge: 60 * 60 * 24 * 7
                }));
                return res.json(username);
            });
        });

    });
});

app.post('/signin/',  function (req, res, next) {
   
  var username = req.body.username;
    var password = req.body.password;
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
            req.session.username = username;
            res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                path : '/', 
                maxAge: 60 * 60 * 24 * 7
            }));
            return res.json({username});
        });

        
    });
});

app.get('/authenticate/', function(req, res, next){
  console.log("authenticate session")
  console.log(req.session)
  if(req.session.username) {
    return res.status(200).send({status:"success"});
  } else {
    return res.status(401).send({status:"failure"});
  }
});






app.listen({ port: 3001 }, () =>
  console.log(`Server running on http://localhost:3001, test queries on http://localhost:3001/graphql`)
  
);