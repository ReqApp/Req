var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util.js')

var betsFinishedSchema = new Schema({
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
        maxLength: 48
    },
    type: {
        type: String
    },
    // Redundant
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
    // Redundant
    tester: {
        type: String
    },
    secondPlaceCut: {
        type: Number,
        default: 0
    },
    thirdPlaceCut: {
        type: Number,
        default: 0
    },
    forTotal: {
        type: Number,
        default: 0
    },
    againstTotal: {
        type: Number,
        default: 0
    },
    // Multi 
    commonTotal: {
        type: Number,
        default: 0
    },
    winners: [{
        user_name: String,
        payout: Number,
        profilePicture: String
    }],
    losers: [{
        user_name: String
    }],
    // Answer
    result: {
        type: String
    }
});

module.exports = mongoose.model('betsFinished', betsFinishedSchema);