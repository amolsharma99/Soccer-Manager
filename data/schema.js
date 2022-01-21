const { makeExecutableSchema } = require("@graphql-tools/schema");
const resolvers = require('./resolvers');

const typeDefs = `
    type User {
        name: String
        email: String
        password: String
    }

`;

const schema = makeExecutableSchema({typeDefs, resolvers})

module.exports = schema;