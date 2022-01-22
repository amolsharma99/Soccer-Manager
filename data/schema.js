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

    enum PlayerType {
        GOALKEEPER
        DEFENDER
        MIDFIELDER
        ATTACKER
    }

    type Player {
        id: ID
        firstName: String
        lastName: String
        playerType: PlayerType
        country: String
        age: Int
        value: Int
        teamId: ID
    }

    type TransferList{
        playerId: ID
        askPrice: Int
    }

    type ViewTeamOutput{
        team: Team
        players: [Player]
    }

    type Query {
        getOneUser(id: ID): User
        viewTeam(id: ID): ViewTeamOutput
    }

    type Mutation {
        createTeam(userid: ID!): Team
    }

`;

const schema = makeExecutableSchema({typeDefs, resolvers})

module.exports = schema;