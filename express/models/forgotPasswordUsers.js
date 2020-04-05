var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
require('./util');

var forgotPasswordUsersSchema = new Schema ({
    user_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 32
    },
    email: {
        type:String,
        minlength: 5,
        maxlength: 64,
        required: true
    },
    resetCode: {
        type: String,
        minLength: 10,
        required: true
    }
});

// synchronously hashes the password with 8 chars of salt
forgotPasswordUsersSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

// Exports forgotPasswordUsersSchema as forgotPasswordUser to other scripts
module.exports = mongoose.model('forgotPasswordUser', forgotPasswordUsersSchema);