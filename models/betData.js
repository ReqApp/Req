var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util.js')

var betSchema = new Schema({
    title : String, 
    location_Name : String,
    // TODO add fields for odds, user, bet statement, comments etc
    latitude : Number,
    longitude : Number,
    radius : Number
    
});

module.exports = mongoose.model('Bets', betSchema);