var User = require('../models/users');

function getProfilePicture(username) {
    return new Promise((resolve, reject) => {
        User.findOne({user_name: username}, (err, foundUser) => {
            if (err) {
                reject(err);
            }
            if (foundUser) {
                if (foundUser.profilePicture != null) {
                    resolve(foundUser.profilePicture);
                } else {
                    // they have no profile picture
                    // handle this in the function calling it
                    resolve("noprofiler");
                }
            } else {
                resolve(null);
            }
        })
    });     
}

function getCoins(username) {
    return new Promise((resolve, reject) => {
        User.findOne({user_name: username}, (err, foundUser) => {
            if (err) {
                reject(err);
            }
            if (foundUser) {
                resolve(foundUser.coins);
            } else {
                resolve(null);
            }
        });
    });
}

module.exports.getCoins = getCoins;
module.exports.getProfilePicture = getProfilePicture;