var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
require('./util');

var unverifiedUsersSchema = new Schema ({
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
    password: {
        type: String,
        minlength: 8
    },
    profilePicture: {
        type: String,
        default: null
    },
    activationCode: {
        type: String,
        minlength: 6,
        required: true
    }
});

// synchronously hashes the password with 8 chars of salt
unverifiedUsersSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

// Exports unverifiedUsersSchema as User to other scripts
module.exports = mongoose.model('UnverifiedUser', unverifiedUsersSchema);