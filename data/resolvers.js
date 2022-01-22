const Player = require("./player");
const Team = require("./team");
const TransferList = require("./transferList");
const User = require("./user");

//resolver map
const resolvers = {
    Query: {
        getOneUser: (root, { id }) => {
            return new Promise((resolve, reject) => {
                User.findById(id, (err, user) => {
                    if (err) reject(err)
                    else resolve(user)
                })
            })
        },

        viewTeam: (root, { id }) => {

            const team = new Promise((resolve, reject) => {
                Team.findById(id, (err, team) => {
                    if (err) reject(err)
                    else resolve(team)
                })
            })

            const players = new Promise((resolve, reject) => {
                Player.find({ teamId: id }, (err, players) => {
                    if (err) reject(err)
                    else resolve(players)
                })
            })

            return {
                "team": team,
                "players": players
            };
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

            new Promise((resolve, reject) => {
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

                new Promise((resolve, reject) => {
                    newPlayer.save((err) => {
                        if (err) reject(err)
                        else resolve(newPlayer)
                    })
                })
            }
            return newTeam
        },

        offerTransfer: (root, { input }) => {
            //TODO: check if valid Player
            return new Promise((resolve, reject) => {
                TransferList.findOneAndUpdate({ playerId: input.playerId }, { "playerId": input.playerId, "askPrice": input.askPrice }, { new: true, upsert: true }, (err, transferListEntry) => {
                    if (err) reject(err)
                    else resolve(transferListEntry)
                })
            })
        },

        buyPlayer: (root, { input }) => {
            const player = new Promise((resolve, reject) => {
                //Update TeamId for Player
                Player.findOneAndUpdate({ _id: input.playerId }, { "teamId": input.teamId }, (err, player) => {
                    if (err)
                        reject(err)
                    else
                        resolve(player)
                })
            }).then(player => {
                new Promise((resolve, reject) => {
                    //Update Player Value
                    Player.findOneAndUpdate({ "_id": input.playerId }, { "value": player.value * 1.2 }, (err, updatedPlayer) => {
                        if (err) reject(err)
                        else resolve("Updated Player Value")
                    })
                })
            })

            new Promise((resolve, reject) => {
                //Remove Player from Transfer List
                TransferList.remove({ playerId: input.playerId }, (err) => {
                    if (err) reject(err)
                    else resolve("Purchased Player")
                })
            })
            return "Purchased Player"
        }

    }
};

module.exports = resolvers;