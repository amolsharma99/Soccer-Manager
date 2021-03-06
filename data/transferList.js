const mongoose = require('mongoose');
const TransferListSchema = new mongoose.Schema({
    playerId: {
        type: String,
        required: true
    },
    askPrice: {
        type: Number,
        required: true
    }
});
const TransferList = mongoose.model('TransferList', TransferListSchema);

module.exports = TransferList;