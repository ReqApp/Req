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

function handleBigButtonPress() {
    return new Promise((resolve, reject) => {
        fs.readFile("./logFiles/bigButton.txt", "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } 
            if (data) {
                fs.writeFile("./logFiles/bigButton.txt", parseInt(data)+1, (err) => {
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

function resetBigButtonPress() {
    return new Promise((resolve, reject) => {
        fs.readFile("./logFiles/bigButton.txt", "utf-8", (err, data) => {
            if (err) {
                console.log(`no read`)
                reject(err);
            } 
            if (data) {
                fs.writeFile("./logFiles/bigButton.txt", "0", (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    console.log(`success replacement`)
                    resolve(true);
                });
            } else {
                console.log(`no data`)
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

function getBigButtonCurrentID() {
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
module.exports.resetBigButtonPress = resetBigButtonPress;
module.exports.handleBigButtonPress = handleBigButtonPress;
module.exports.getBigButtonCurrentID = getBigButtonCurrentID;
module.exports.writeBigButtonCurrentID = writeBigButtonCurrentID;
