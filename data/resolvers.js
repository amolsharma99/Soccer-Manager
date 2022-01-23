const Player = require("./player");
const Team = require("./team");
const TransferList = require("./transferList");
const User = require("./user");
const { uniqueNamesGenerator, adjectives, colors, names, countries, starWars, animals, NumberDictionary } = require('unique-names-generator');

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

            teamValue = 0;
            return new Promise((resolve, reject) => {
                Team.findById(id, (err, team) => {
                    if (err) reject(err)
                    else resolve(team)
                })
            }).then(team => {
                return new Promise((resolve, reject) => {
                    Player.find({ teamId: id }, (err, players) => {
                        if (err) reject(err)
                        else resolve(players)
                    })
                }).then(players => {
                    players.forEach(player => {
                        teamValue += player.value
                    });

                    return {
                        "team": team,
                        "teamValue": teamValue,
                        "players": players
                    };
                })
            })
        },

        viewTransferList: (root) => {
            return new Promise((resolve, reject) => {
                TransferList.find({}, (err, offers) => {
                    if (err) reject(err)
                    else resolve(offers)
                })
            }).then(offers => {
                var response = [];
                offers.forEach(element => {
                    const player = new Promise((resolve, reject) => {
                        Player.findOne({ _id: element.playerId }, (err, player) => {
                            if (err)
                                reject(err)
                            else
                                resolve(player)
                        })
                    });
                    response.push({ "player": player, "askPrice": element.askPrice });
                });
                return response;
            })
        }
    },
    Mutation: {
        //Create Default Team
        createTeam: (root, { userId }) => {

            return new Promise((resolve, reject) => {
                User.findOne({ _id: userId }, (err, user) => {
                    if (err) reject(err)
                    else resolve(user)
                })
            }).then(user => {
                //Throw Error if Team Already Exist for the User
                if (user.teamId) {
                    console.log("team " + user.teamId + " already exists for user " + userId);
                    return new Error("Team Already Exists for User");
                }
                else {
                    const teamName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, names] });
                    const teamCountry = uniqueNamesGenerator({ dictionaries: [countries] });

                    //Create Team
                    const newTeam = new Team({
                        name: teamName,
                        country: teamCountry,
                        budget: 5000000
                    })

                    return new Promise((resolve, reject) => {
                        newTeam.save((err) => {
                            if (err) reject(err)
                            else resolve(newTeam)
                        })
                    }).then(newTeam => {
                        new Promise((resolve, reject) => {
                            User.findOneAndUpdate({ _id: userId }, { "teamId": newTeam._id }, { new: true }, (err, user) => {
                                if (err) reject(err)
                                else resolve(user)
                            })
                        })
                    }).then(user => {
                        //Create 20 Players with Above Team Id
                        // 3 GK
                        // 6 Defenders
                        // 6 Midfielders
                        // 5 Attackers
                        for (var i = 0; i < 20; i++) {
                            const playerFirstName = uniqueNamesGenerator({ dictionaries: [starWars] });
                            const playerLastName = uniqueNamesGenerator({ dictionaries: [animals] });
                            const playerCountry = uniqueNamesGenerator({ dictionaries: [countries] });
                            const numberDictionary = NumberDictionary.generate({ min: 15, max: 45 });
                            const playerAge = uniqueNamesGenerator({ dictionaries: [numberDictionary] });
                            const playerSkillType = (() => {
                                switch (true) {
                                    case (i < 3):
                                        return "GOALKEEPER";
                                    case (i < 9):
                                        return "DEFENDER";
                                    case (i < 15):
                                        return "MIDFIELDER";
                                    default:
                                        return "ATTACKER";
                                }
                            })();
                            const newPlayer = new Player({
                                firstName: playerFirstName,
                                lastName: playerLastName,
                                playerType: playerSkillType,
                                country: playerCountry,
                                age: playerAge,
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
                        console.log(newTeam)
                        return newTeam
                    })
                }
            });
        },

        updateTeam: (root, { input }) => {
            return new Promise((resolve, reject) => {
                Team.findOneAndUpdate({ _id: input.teamId }, input.updatedFields, { new: true }, (err, updatedTeam) => {
                    if (err) reject(err)
                    else resolve(updatedTeam)
                })
            })
        },

        updatePlayer: (root, { input }) => {
            return new Promise((resolve, reject) => {
                Player.findOneAndUpdate({ _id: input.playerId }, input.updatedFields, { new: true }, (err, updatedPlayer) => {
                    if (err) reject(err)
                    else resolve(updatedPlayer)
                })
            })
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
            //TODO: Validations
            //1. Does the buying team have enough budget
            //2. playerId is valid.
            //3. Player is available for buying from the transferList

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
                    //Update Player Value Randomly
                    Player.findOneAndUpdate({ _id: input.playerId }, { "value": Math.round(player.value * (1.1 + Math.random() * 0.9)) }, (err, updatedPlayer) => {
                        if (err) reject(err)
                        else resolve("Updated Player Value")
                    })

                    new Promise((resolve, reject) => {
                        TransferList.findOne({ playerId: input.playerId }, (err, transferEntry) => {
                            if (err) reject(err)
                            else resolve(transferEntry)
                        }).then(transferEntry => {
                            //Increment Budget of Current Team by Ask Price. Note teamId points to old team.
                            new Promise((resolve, reject) => {
                                Team.findOne({ _id: player.teamId }, (err, team) => {
                                    if (err) reject(err)
                                    else resolve(team)
                                })
                            }).then(team => {
                                Team.findOneAndUpdate({ _id: player.teamId }, { budget: team.budget + transferEntry.askPrice }, (err, updatedTeam) => {
                                    if (err) reject(err)
                                    else resolve(updatedTeam)
                                })
                            })
                            //Decrement Budget of Current Team by Ask Price
                            new Promise((resolve, reject) => {
                                Team.findOne({ _id: input.teamId }, (err, team) => {
                                    if (err) reject(err)
                                    else resolve(team)
                                })
                            }).then(team => {
                                Team.findOneAndUpdate({ _id: input.teamId }, { budget: team.budget - transferEntry.askPrice }, (err, updatedTeam) => {
                                    if (err) reject(err)
                                    else resolve(updatedTeam)
                                })
                            })
                        })
                    })
                })
            }).then(object => {
                new Promise((resolve, reject) => {
                    //Remove Player from Transfer List
                    TransferList.remove({ playerId: input.playerId }, (err) => {
                        if (err) reject(err)
                        else resolve("Purchased Player")
                    })
                })
            })
            return "Purchased Player"
        }

    }
};

module.exports = resolvers;