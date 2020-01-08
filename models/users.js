var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
require('./util');

var usersSchema = new Schema({
    user_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 32
    },
    password: {
        type: String,
        minlength: 8
    },
    fbID: {
        type: String,
        default: null
    },
    accessToken: String
});

// synchronously hashes the password with 8 chars of salt
usersSchema.methods.generateHash = (password) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync());
    }
    // synchronously compares the hashes 
usersSchema.methods.validPassword = (password) => {
        return bcrypt.compareSync(password, this.password);
    }
    // Exports usersSchema as User to other scripts
module.exports = mongoose.model('User', usersSchema);