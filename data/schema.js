const { makeExecutableSchema } = require("@graphql-tools/schema");
const resolvers = require('./resolvers');

const typeDefs = `
    type User {
        id: ID
        name: String
        email: String
        password: String
        teamID: ID
    }

    type Team {
        id: ID
        name: String
        country: String
        budget: Int
    }

    type Player {
        id: ID
        firstName: String
        lastName: String
        country: String
        age: Int
        value: Int
        teamId: ID
    }

    type TransferList{
        playerId: ID
        askPrice: Int
    }

    type Query {
        getOneUser(id: ID): User
    }

    type Mutation {
        createTeam(id: ID!): Team
    }

`;

const schema = makeExecutableSchema({typeDefs, resolvers})

module.exports = schema;