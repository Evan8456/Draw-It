const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    hello: String
  }
`;


const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};


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
﻿