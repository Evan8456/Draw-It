const {gql} = require("apollo-server-express");

const resolvers = {
    Query:{
        users(){
            return
        }
    }
}

module.exports = { resolvers };