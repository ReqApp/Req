var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util');

var articleBetSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 64
    },
    subtext: {
        type: String,
        minlength: 1,
        maxlength: 64
    },
    result: {
        type: String
    },
    timePosted: {
        type: String,
    },
    for: {
        type: Number,
        default: 0
    },
    against: {
        type: Number,
        default: 0
    },
    ends: {
        type: String
    }
});

// Exports usersSchema as User to other scripts
module.exports = mongoose.model('articleBet', articleBetSchema);