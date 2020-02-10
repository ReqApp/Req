var mongoose = require('mongoose');
// var connection = mongoose.connect('mongodb://mongodb5436oc:qi4bah@danu7.it.nuigalway.ie:8717/mongodb5436', 
// { useNewUrlParser: true, useUnifiedTopology: true });
var connection = mongoose.connect(process.env.mongoDBDetails, { useNewUrlParser: true, useUnifiedTopology: true });


exports.connection = connection;