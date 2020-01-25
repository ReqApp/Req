var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util.js');

var bettingRegionSchema = new Schema({
    region_name : {
        type : String
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
        type : [Number]
    }
});

module.exports = mongoose.model('BettingRegion', bettingRegionSchema);