const {gql} = require("apollo-server-express");

const typeDefs=gql`
    type User{
        id: ID!
        username: String!
        hash: String!
    }
    type Mutation {
        signup(username:String!, password:String!): String
        signin(username:String!, password:String!): String
    }
    type Query{
        users: [User!]!
        signout: String
        authenticate: String
    }
`;

module.exports = { typeDefs };