var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util.js')

// TODO update docs
var locationBetSchema = new Schema({
    location_Name : {
        type : String,
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
    bet_region_id : {
        type : String
    },
    // ID of actual bet
    bet_id : {
        type: String
    }
});

module.exports = mongoose.model('Bets', locationBetSchema);