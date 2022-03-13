const {gql} = require("apollo-server");

const typeDefs=gql`
    type User{
        id: ID!
        username: String!
        hash
    }
    type Query{
        users: [User!]!
    }
`;

module.exports = { typeDefs };