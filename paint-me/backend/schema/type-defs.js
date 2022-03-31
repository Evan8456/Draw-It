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
        addDrawing(name:String!, public:Boolean!): String
        findRoom(_id:String!): Boolean
        loadImage(_id:String!): Boolean
    }
    type Query{
        users: [User!]!
        signout: String
        authenticate: String
        privateDrawings: [Picture]
        sharedDrawings: [Picture]
        publicDrawings: [Picture]
    }
`;

module.exports = { typeDefs };