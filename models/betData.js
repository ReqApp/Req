var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util.js')

var betSchema = new Schema({
    title : { 
        type : String
    } , 
    location_Name : {
        type : String,
    },
    latitude : {
        type :Number
    },
    longitude : {
        type : Number
    },
    radius : {
        type :Number
    }
});

module.exports = mongoose.model('Bets', betSchema);