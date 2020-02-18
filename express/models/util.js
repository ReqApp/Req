var mongoose = require('mongoose');
var connection = mongoose.connect(process.env.mongoDBDetails, { useNewUrlParser: true, useUnifiedTopology: true });

exports.connection = connection;