var mongoose = require('mongooose');
var Schema = mongoose.Schema;
require('./util.js')

var betSchema = new Schema({
    title : {type : String},
    location_Name : {type : String},
    // TODO add fields for odds, user, bet statement, comments etc
    latlong : [Number],
    radius : {type : Number}
});

module.exports = mongoose.model('Bets', betSchema);