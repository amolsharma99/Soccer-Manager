const Team = require("./team");
const User = require("./user");

//resolver map
const resolvers = { 
    Query: {
        getOneUser:(root, {id}) => {
            return new Promise((resolve, object) => {
                User.findById(id, (err, user) => {
                    if(err) reject(err)
                    else resolve(user)
                })
            })
        }
    },
    Mutation: {
        //Create Default Team
        createTeam : (root, {userId}) => {

            //TODO: check if team already exists for userID

            //Create Team
            const newTeam = new Team({
                name: "Some Team Name",
                country: "UK",
                budget: 5000000
            })

            return new Promise((resolve, object) => {
                newTeam.save((err) => {
                    if(err) reject(err)
                    else resolve(newTeam)
                })
            })

            //Create 20 Players with Above Team Id
            // 3 GK
            // 6 Defenders
            // 6 Midfielders
            // 5 Attackers
        }        
    }
};

module.exports = resolvers;