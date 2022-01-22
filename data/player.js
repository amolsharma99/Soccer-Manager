const mongoose = require('mongoose');
const PlayerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    playerType:{
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    teamId: {
        type: String,
        required: true
    }
});
const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;