const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const test = require('dotenv').config();
const mongoose = require('mongoose');
const messageModel = require('./models/message');
const userModel = require('./models/user');
const roomModel = require('./models/room');
const pictureModel = require('./models/picture');

const {typeDefs} = require("./schema/type-defs");
const {resolvers} = require("./schema/resolvers");

mongoose.connect(process.env.MONGODB_CONNECTION);


const app = express();

async function start() {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start()
    
    server.applyMiddleware({ app });
}
start();


app.listen({ port: 3001 }, () =>
  console.log(`Server running on http://localhost:3001, test queries on http://localhost:3001/graphql`)
  
);