const Player = require("./player");
const Team = require("./team");
const User = require("./user");

//resolver map
const resolvers = {
    Query: {
        getOneUser: (root, { id }) => {
            return new Promise((resolve, object) => {
                User.findById(id, (err, user) => {
                    if (err) reject(err)
                    else resolve(user)
                })
            })
        }
    },
    Mutation: {
        //Create Default Team
        createTeam: (root, { userId }) => {

            //TODO: check if team already exists for userID

            //Create Team
            const newTeam = new Team({
                name: "Some Team Name",
                country: "UK",
                budget: 5000000
            })

            new Promise((resolve, object) => {
                newTeam.save((err) => {
                    if (err) reject(err)
                    else resolve(newTeam)
                })
            })

            //Create 20 Players with Above Team Id
            // 3 GK
            // 6 Defenders
            // 6 Midfielders
            // 5 Attackers
            const players = [];
            for (var i = 0; i < 20; i++) {
                const newPlayer = new Player({
                    firstName: "abc",
                    lastName: "xyz",
                    playerType: "MIDFIELDER",
                    country: "India",
                    age: 30,
                    value: 100000,
                    teamId: newTeam._id
                })

                new Promise((resolve, object) => {
                    newPlayer.save((err) => {
                        if (err) reject(err)
                        else resolve(newPlayer)
                    })
                })
            }
            return newTeam
        }
    }
};

module.exports = resolvers;