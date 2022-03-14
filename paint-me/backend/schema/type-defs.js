const {gql} = require("apollo-server-express");

const typeDefs=gql`
    type User{
        id: ID!
        username: String!
        hash: String!
    }
    type Query{
        users: [User!]!
    }
`;

module.exports = { typeDefs };