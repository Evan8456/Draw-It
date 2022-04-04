const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const test = require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('./models/user');
const drawingModel = require('./models/privateDrawing');
const fs = require('fs');
const {typeDefs} = require("./schema/type-defs");
const {resolvers} = require("./schema/resolvers");
const cors = require('cors');
const multer = require('multer');

mongoose.connect(process.env.MONGODB_CONNECTION);

mongoose.connection.once('open', function() { 
  console.log('Connected to the Database.');
});

mongoose.connection.on('error', function(error) {
  console.log('Mongoose Connection Error : ' + error);
});
  
const app = express();
const router = express.Router();

if(!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cookie = require('cookie');
var sharedsession = require("express-socket.io-session");

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, "./uploads");
  },

  filename: function(req, file, cb) {
      let extension = file.mimetype.split("/")[1];
      cb(null, req.body._id + "." + extension);
  }
});
let upload = multer({storage});

var corsOptions = {
  origin:['http://localhost:3000', 'https://studio.apollographql.com'],
  credentials: true
};

//DEV ONLY
if(process.env.ENVIRONMENT == "dev") {
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
  app.use(cors({
    origin:['http://localhost:3000', 'https://studio.apollographql.com'],
    credentials: true
  }));
  // cors for dev
  app.use(session);
  const httpServer = require("http").createServer(app);
  
  const io = require("socket.io")(httpServer,
    {cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }});
  // both use
  //socket io
  io.use(sharedsession(session, {
    autoSave:true
  })); 
  io.on("connection", socket =>{
    socket.on("drawing", (data, room) =>{
      socket.to(room).emit('drawing', data);
    });
    socket.on("join-room", (room) =>{
      var rooms = socket.rooms;
      rooms.forEach(element => {
        socket.leave(element);
      });

      socket.join(room);
      // save drawing
      socket.to(room).emit("save-drawing", socket.id);
    });
    socket.on("load-image-bk", (room, sid) =>{
      socket.to(room).emit("load-image", sid);
    });
  });
  // apollo server
  async function start() {
    const server = new ApolloServer({ typeDefs, resolvers,
    context: ({req, res}) => ({req, res}),
    cors: false
    });
    await server.start();
    
    server.applyMiddleware({ app, cors:corsOptions });
  }
  start();
  httpServer.listen(3002, () => {
    console.log("Websocket started at port test ", 3002);
  });
} else {
  var privateKey  = fs.readFileSync('/etc/letsencrypt/live/draw-it.me/privkey.pem');
  var certificate = fs.readFileSync('/etc/letsencrypt/live/draw-it.me/cert.pem');
  var chain = fs.readFileSync('/etc/letsencrypt/live/draw-it.me/chain.pem');
  var httpsServer = 
  require('https').createServer({key: privateKey,
    cert: certificate,
    ca: chain,
    requestCert: false,
    rejectUnauthorized: false },app);
  var session = require("express-session")({
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true,
      samesite : 'strict'
     }
  });
  const io = require("socket.io")(httpsServer, {
    origins: 'https://localhost:3000'});
  // both use
  //socket io
  io.use(sharedsession(session, {
    autoSave:true
  })); 
  io.on("connection", socket =>{
    socket.on("drawing", (data, room) =>{
      socket.to(room).emit('drawing', data);
    });
    socket.on("join-room", (room) =>{
      var rooms = socket.rooms;
      rooms.forEach(element => {
        socket.leave(element);
      });
      socket.join(room);
      // save drawing
      socket.to(room).emit("save-drawing", socket.id);
    });
    socket.on("load-image-bk", (room, sid) =>{
      socket.to(room).emit("load-image", sid);
    });
  });
  // apollo server
  app.use(session);
  async function start() {
    const server = new ApolloServer({ typeDefs, resolvers,
    context: ({req, res}) => ({req, res})});
    await server.start();
    
    server.applyMiddleware({ app });
  }
  start();

  httpsServer.listen(3002, () => {
    console.log("Websocket started at port test server", 3002);
  });
}

// rest api
var isAuthenticated = function(req, res, next) {
  if (!req.session.username) return res.status(401).end("access denied");
  next();
};
app.use(function (req, res, next){
  var cookies = cookie.parse(req.headers.cookie || '');
  console.log(req.session.username);
  req.username =(req.session.user)? req.session.user.username : '';
  console.log("HTTP request", req.username, req.method, req.url, req.body);
  next();
});

app.post("/api/drawing", isAuthenticated, upload.single("image"), function(req, res, next) {
  const _id = req.body._id;
  drawingModel.findById(_id, function(err, doc) {
    if (err) return res.status(500).end(err);
    if (!doc) return res.status(404).send();
    if (!doc.public && doc.username != req.session.username) return res.status(401).send();

    doc.path = req.file;
    doc.save().then(function (savedDoc) {
      res.json(savedDoc);
      next();
    });
  });
});

app.get("/api/drawing/:id", isAuthenticated, function(req, res, next) {
  const _id = req.params.id;

  drawingModel.findById(_id, function(err, doc) {
    if (err) return res.status(500).end(err);
    if (!doc) return res.status(404).send();
    if (!doc.public && doc.username != req.session.username) return res.status(401).send();
  
    let image = doc.path;

    if(image !== null && image !==undefined){
      if(image.mimetype !== null && image.mimetype !==undefined){
        res.setHeader('Content-Type', image.mimetype);
        res.sendFile(__dirname + "/" + image.path);
      }else{
        res.status(400).end("bad request");
      }
     
    }else{
      res.status(400).end("bad request");
    }
    
  });
});