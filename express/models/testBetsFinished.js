var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util.js')

var testBetsFinishedSchema = new Schema({
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
    commonTotal: {
        type: Number,
        default: 0
    },
    winners: [{
        user_name: String,
        payout: Number,
        profilePicture: String
    }],
    result: {
        type: Number
    }
});

module.exports = mongoose.model('testBetsFinished', testBetsFinishedSchema);