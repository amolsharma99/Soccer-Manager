const mongoose = require('mongoose');
const PlayerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    age: {
        type: Int,
        required: true
    },
    value: {
        type: Int,
        required: true
    },
    teamId: {
        type: String,
        required: true
    }
});
const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;