const { makeExecutableSchema } = require("@graphql-tools/schema");
const resolvers = require('./resolvers');

const typeDefs = `
    scalar Date
    
    type User {
        name: String
        email: String
        password: String
        date: Date
    }

`;

const schema = makeExecutableSchema({typeDefs, resolvers})

module.exports = schema;