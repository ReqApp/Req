var mongoose = require('mongoose');
var connection = mongoose.connnect('mongodb://mongodb5435oc:to1quk@danu7.it.nuigalway.ie:8717/mongodb5435oc', { useNewUrlParser: true, useUnifiedTopology: true });

exports.connection = connection;