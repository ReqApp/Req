var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util.js')

var testBetSchema = new Schema({
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
    side: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0,
        required: true
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
});

module.exports = mongoose.model('testBets', testBetSchema);