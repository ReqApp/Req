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
    amount: {
        type: Number,
        default: 0
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
    firstPlace: {
        type: Number,
        default: 0
    },
    secondPlace: {
        type: Number,
        default: 0
    },
    thirdPlace: {
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