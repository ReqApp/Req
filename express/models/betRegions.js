var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util.js');

var betRegionSchema = new Schema({
    region_name : {
        type : String,
        required : true,
        minlength : 1,
        maxlength : 64
    },
    description : {
        type : String,
        maxlength : 300
    },
    latitude : {
        type : Number
    },
    longitude : {
        type : Number
    },
    radius : {
        type : Number
    },
    num_bets : {
        type : Number,
        default : 0
    },
    bet_ids : {
        type : [mongoose.ObjectId]
    }
});

module.exports = mongoose.model('BettingRegion', betRegionSchema);