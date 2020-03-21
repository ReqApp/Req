var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util.js')

var betSchema = new Schema({
    user_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 32
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxLength: 64
    },
    type: {
        type: String
    },
    side: {
        type: String,
        default: null
    },
    deadline: {
        type: String,
        required: true
    },
    forUsers: [{
        user_name: String,
        betAmount: Number
    }],
    againstUsers: [{
        user_name: String,
        betAmount: Number
    }],
    commonBets: [{
        user_name: String,
        betAmount: Number,
        bet: Number
    }],
    firstPlaceCut: {
        type: Number,
        default: 0
    },
    secondPlaceCut: {
        type: Number,
        default: 0
    },
    thirdPlaceCut: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('bets', betSchema);