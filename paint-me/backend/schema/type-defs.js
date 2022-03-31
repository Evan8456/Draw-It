const {gql} = require("apollo-server-express");

const typeDefs=gql`
    type User{
        id: ID!
        username: String!
        hash: String!
    }
    type Picture {
        path: String
        name: String!
        username: String!
        _id: String!
    }
    type Mutation {
        signup(username:String!, password:String!): String
        signin(username:String!, password:String!): String
        addPrivateDrawing(name:String!): String
    }
    type Query{
        users: [User!]!
        signout: String
        authenticate: String
        privateDrawings: [Picture]
        sharedDrawings: [Picture]
    }
`;

module.exports = { typeDefs };