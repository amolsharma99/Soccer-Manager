const mongoose = require('mongoose');
const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    }
});
const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;