var User = require('../models/users');
var fs = require("fs");

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

function handleRedButtonPress() {
    return new Promise((resolve, reject) => {
        fs.readFile("bigButton.txt", "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } 
            if (data) {
                fs.writeFile("bigButton.txt", parseInt(data)+1, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(parseInt(data)+1);
                });
            } else {
                resolve(null);
            }
          });
    });
}

function writeBigButtonCurrentID(betID) {
    return new Promise((resolve, reject) => {
        // file paths are from the perspective of app.js???????????? WHY
        fs.readFile("./logFiles/bigRedButtonID.txt", "utf-8", (err, data) => {
            if (err) {
                reject(err);
            }
            if (data) {
                fs.writeFile("./logFiles/bigRedButtonID.txt", betID, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
            } else {
                resolve(null);
            }
          });
    });
}

function getBigButtonCurrentID(betID) {
    return new Promise((resolve, reject) => {
        // file paths are from the perspective of app.js???????????? WHY
        fs.readFile("./logFiles/bigRedButtonID.txt", "utf-8", (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
          });
    });
}

module.exports.getCoins = getCoins;
module.exports.getProfilePicture = getProfilePicture;
module.exports.handleRedButtonPress = handleRedButtonPress;
module.exports.getBigButtonCurrentID = getBigButtonCurrentID;
module.exports.writeBigButtonCurrentID = writeBigButtonCurrentID;
