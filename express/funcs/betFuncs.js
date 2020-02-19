var forgotPasswordUser = require('../models/forgotPasswordUsers');
var UnverifiedUser = require('../models/unverifiedUsers');
var articleBet = require('../models/articleBets');
const keccak512 = require('js-sha3').keccak512;
var testBets = require('../models/testBets');
var User = require('../models/users');
var jwt = require('jsonwebtoken');
const axios = require("axios");


function getBets() {
    return new Promise((resolve, reject) => {
        testBets.find({}, (err, response) => {
            if (err) {
                reject(err);
            } else {
                if (response){
                    resolve(response);
                } else {
                    resolve(null);
                }
            }
        })
    });
}

function validate(input, type) {
    const conditions = ["\"", "<", ">", "'", "`"];

    switch (type) {
        case 'id':
            if (!input) {
                return false;
            }
            if (input.match(/([^A-Za-z0-9]+)/g)) {
                return false;
            } else {
                return true;
            }
        case 'result':
            if (!input) {
                return false;
            }
            if (input.toLowerCase() === "yes" || input.toLowerCase() === "no") {
                return true;
            } else {
                return false;
            }
        case 'password':
            if (input.length > 8) {
                let test2 = conditions.some(el => input.includes(el));
                if (test2) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        case 'username':
            if (input.length < 32 && input.length > 0) {
                return true;
            } else {
                return false;
            }
        case 'url':
            let test2 = conditions.some(el => input.includes(el));
            if (test2) {
                return false;
            } else {
                return true;
            }
        case 'article':
            return true;
    }
}

function betOn(userObj) {
    return new Promise((resolve, reject) => {
        if (userObj.side === "yes") {
            testBets.findOneAndUpdate({ _id: userObj.betID }, { $push: { forUsers: { user_name: userObj.username, betAmount: userObj.amount } } },
                (err, result) => {
                    if (err) {
                        reject(err);
                        var User = require('../models/users');
                    } else {
                        if (result) {
                            console.log(`bet added`);
                            resolve(true);
                        } else {
                            resolve(null);
                        }
                    }
                });
        } else {
            testBets.findOneAndUpdate({ _id: userObj.betID }, { $push: { againstUsers: { user_name: userObj.username, betAmount: userObj.amount } } },
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result) {
                            resolve(true);
                        } else {
                            resolve(null);
                        }
                    }
                });
        }
    })
}

function alreadyBetOn(userObj) {
    return new Promise((resolve, reject) => {
        testBets.findOne({ _id: userObj.betID }, (err, res) => {
            if (err) {
                reject(err);
            } else {
                if (res) {
                    if (userObj.side === "yes") {
                        for (indivBet of res.forUsers) {
                            if (indivBet.user_name === userObj.username) {
                                resolve(true);
                            }
                        }
                        resolve(null);
                    } else {
                        if (userObj.side === "no") {
                            for (indivBet of res.againstUsers) {
                                if (indivBet.user_name === userObj.username) {
                                    resolve(true);
                                }
                            }
                        }
                        resolve(null);
                    }

                } else {
                    reject('Invalid bet ID');
                }
            }
        });
    });
}

function isPasswordCompromised(input) {
    return new Promise((resolve, reject) => {
        const hashed = keccak512(input);
        axios.get(`https://passwords.xposedornot.com/api/v1/pass/anon/${hashed.slice(0,10)}`).then((data) => {
            if (data.Error) {
                // Error in this case means that the password was NOT found
                resolve(null);
            } else {
                resolve(true);
            }
        }).catch(((err) => {
            reject(null);
        }));
    });
}

function hasEnoughCoins(username, transactionAmount) {
    return new Promise((resolve, reject) => {
        User.findOne({ user_name: username }, (err, foundUser) => {
            if (err) {
                reject(err);
            } else {
                if (foundUser) {
                    if (foundUser.coins >= transactionAmount) {
                        foundUser.coins -= transactionAmount;
                        foundUser.save((err) => {
                            if (err) {
                                reject(err);
                            }
                        })
                        resolve(true);
                    } else {
                        resolve(null);
                    }
                }
            }
        });
    });
}

function payOut(username, percentage, winnings) {
    return new Promise((resolve, reject) => {
        User.findOne({ user_name: username }, (err, foundUser) => {
            if (err) {
                reject(err);
            }
            if (foundUser) {
                foundUser.coins += Math.floor(percentage * winnings);
                foundUser.save((err) => {
                    reject(err);
                });

                resolve(percentage * winnings);
            } else {
                resolve(null);
            }
        })
    })
}

function deleteBet(betID) {
    return new Promise((resolve, reject) => {
        testBets.deleteOne({ _id: betID }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        })
    })
}

function decideBet(inputObj) {
    return new Promise((resolve, reject) => {
        let currTime = new Date();

        testBets.findOne({ _id: inputObj.betID }, (err, foundBet) => {
            if (err) {
                reject(err);
            }
            if (foundBet) {
                // currTime - deadline + a fair bit of time
                if (currTime.getTime() - (foundBet.deadline + 21600000) >= 0) {
                    reject("Expired");
                } else {
                    // not expired, dish out the winnings
                    anonymiseBetData([foundBet]).then((betData) => {
                        if (betData) {

                            // payout to the setter
                            const againstTotal = parseInt(betData[0].againstBetTotal, 10);
                            const forTotal = parseInt(betData[0].forBetTotal, 10);

                            payOut(foundBet.user_name, 0.1, againstTotal + forTotal).then(() => {});

                            if (inputObj.result === "yes") {
                                // if yes wins
                                if (foundBet.forUsers.length > 0) {
                                    for (bet of foundBet.forUsers) {

                                        let payPercentage = (bet.betAmount / parseInt(betData[0].forBetTotal, 10));

                                        payOut(bet.user_name, payPercentage, betData[0].againstBetTotal).then((response) => {
                                            if (response) {
                                                console.log(`Paid out ${Math.floor(response) } successfully`);
                                            } else {
                                                console.log(`Paid out 0 unsuccessfully`);
                                            }
                                            // if paid out anything or nothing, still delete the bet
                                            deleteBet(inputObj.betID).then((response) => {
                                                if (response) {
                                                    resolve(true);
                                                }
                                            }, (err) => {
                                                reject(err);
                                            })

                                        }, (err) => {
                                            reject(err);
                                        })
                                    }
                                } else {
                                    console.log("no for users");
                                    resolve(null);
                                }
                            }
                            if (inputObj.result === "no") {
                                // if no wins
                                if (foundBet.againstUsers.length > 0) {
                                    for (bet of foundBet.againstUsers) {

                                        let payPercentage = (bet.betAmount / parseInt(betData[0].againstBetTotal, 10));
                                        payOut(bet.user_name, payPercentage, betData[0].forBetTotal).then((response) => {
                                            if (response) {
                                                console.log(`Paid out ${Math.floor(response) } successfully`);
                                            } else {
                                                console.log(`Paid out 0 unsuccessfully`);
                                            }
                                            // if paid out anything or nothing, still delete the bet
                                            deleteBet(inputObj.betID).then((response) => {
                                                if (response) {
                                                    resolve(true);
                                                }
                                            }, (err) => {
                                                reject(err);
                                            })

                                        }, (err) => {
                                            reject(err);
                                        })
                                    }
                                } else {
                                    console.log("no against users");
                                    resolve(null);
                                }
                            }
                        } else {
                            resolve(null);
                        }
                    }, (err) => {
                        reject(err);
                    })
                }
            } else {
                resolve(null);
            }
        });
    })
}

function makeArticleBet(input, username) {
    return new Promise((resolve, reject) => {
        if (input.sitename && input.directory && input.month &&
            input.year && input.searchTerm && input.ends &&
            input.betAmount && username) {

            if (validate(input.sitename, "article") && validate(input.directory, "article") &&
                validate(input.month, "article") && validate(input.year, "article") &&
                validate(input.searchTerm, "article")) {

                const parsedTime = Date.parse(input.ends);
                const child = require('child_process').execFile;
                const executablePath = "./articleStats/articleGetLinux";
                const parameters = ["-s", input.sitename, input.directory, input.month, input.year, input.searchTerm];

                child(executablePath, parameters, function(err, data) {
                    if (err) {
                        console.log(err);
                        coneole.log("error runnning script")
                        reject(null);
                    } else {
                        // log to DB and then send back ok signal
                        newBet = new articleBet({
                            title: `The ${input.sitename} will have more than 10 articles about'${input.searchTerm}' in ${input.month}/${input.year}`,
                            subtext: `${input.directory} - ${input.month}/${input.year}`,
                            result: data,
                            for: 0,
                            against: 0,
                            ends: parsedTime,
                            forUsers: { user_name: username, betAmount: input.betAmount }
                        });

                        newBet.save((err, user) => {
                            if (err) {
                                console.log("error saving user")
                                reject(err);
                            } else {
                                resolve(user);
                            }
                        });
                    }
                });
            } else {
                // console.log(`Input: ${JSON.stringify(input)}`);
                // console.log("invalid chars in an input");
                reject(null);
            }
        } else {
            // console.log("invalid input numbers");
            // console.log(input);
            resolve(null);
        }
    });
}

function resetPassword(email, newPassword) {
    return new Promise((resolve, reject) => {
        User.findOne({ email: email }, (err, theUser) => {
            if (err) {
                res.send(err);
            }
            if (theUser) {
                theUser.password = theUser.generateHash(newPassword);
                theUser.save((err) => {
                    if (err) {
                        res.send(err);
                        reject(Error(err));
                    } else {
                        console.log("password changed");
                        resolve(theUser.user_name);
                    }
                });
            }
        });
    });
}

function isValidBetID(betID) {
    return new Promise((resolve, reject) => {
        if (betID) {
            testBets.findOne({ _id: betID }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    if (res) {
                        resolve(true);
                    } else {
                        resolve(null);
                    }
                }
            })
        } else {
            resolve(null);
        }
    });
}

function anonymiseBetData(allBets) {
    return new Promise((resolve, reject) => {
        let betArr = [];

        if (!allBets) {
            reject("no bets to parse");
        }

        for (indivBet of allBets) {
            let forTotal = 0;
            let againstTotal = 0;

            if (indivBet.forUsers.length > 0) {
                for (bet of indivBet.forUsers) {
                    forTotal += bet.betAmount;
                }
            }
            if (indivBet.againstUsers.length > 0) {
                for (bet of indivBet.againstUsers) {
                    againstTotal += bet.betAmount;
                }
            }
            let tempBet = {
                title: indivBet.title,
                username: indivBet.user_name,
                deadline: indivBet.deadline,
                forBetTotal: forTotal,
                againstBetTotal: againstTotal
            }
            betArr.push(tempBet);
        }
        resolve(betArr);
    });
}

function isSignedIn(reqCookies) {
    return new Promise((resolve, reject) => {
        if (reqCookies.Authorization) {
            let jwt = reqCookies.Authorization.split(' ')[1];
            const profile = utilFuncs.verifyJwt(jwt);
            if (profile) {
                resolve(profile);
            } else {
                resolve(null);
            }
        } else {
            resolve(null);
        }
    })
}

function createBet(input) {
    return new Promise((resolve, reject) => {
        if (input.title && input.side && input.amount && input.deadline && input.username) {
            let newBet = new testBets();

            newBet.title = input.title;
            newBet.side = input.side;
            newBet.amount = input.amount;
            newBet.deadline = input.deadline;
            newBet.user_name = input.username;

            newBet.save((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });

        } else {
            resolve(false);
        }
    })
}

function checkIfExisting(username, type) {
    if (type === "forgotten") {
        // if there is a forgotten email entry already existing (a link)
        return new Promise(function(resolve, reject) {
            forgotPasswordUser.findOne({ "user_name": username }, (err, foundUser) => {
                if (err) {
                    reject(Error(err))
                } else {
                    if (foundUser) {
                        resolve(null);
                    } else {
                        console.log(`not found`);
                        resolve(username);
                    }
                }
            });
        });
    } else if (type === "unverified") {
        // if there is a forgotten email entry already existing (a link)
        return new Promise(function(resolve, reject) {
            UnverifiedUser.findOne({ "user_name": username }, (err, foundUser) => {
                if (err) {
                    reject(Error(err))
                } else {
                    if (foundUser) {
                        resolve(null);
                    } else {
                        resolve(username);
                    }
                }
            });
        });
    }
}

function sendEmail(email, subject, body) {
    return new Promise((resolve, reject) => {
        const spawn = require("child_process").spawn;
        const pythonProcess = spawn('python3', ["emailService/sendEmail.py", email, subject, body]);
        pythonProcess.stdout.on('data', (data) => {
            // console.log(data.toString());
            resolve()
        });
        pythonProcess.stderr.on('data', (data) => {
            reject(Error(data));
        });
    });
}

function createJwt(profile) {
    return jwt.sign(profile, process.env.JWTSECRET, {
        expiresIn: "3d"
    });
};

function verifyJwt(jwtString) {
    val = jwt.verify(jwtString, process.env.JWTSECRET);
    return val;
}

function calcDistance(storedBet, user) {
    const RAD_EARTH = 6371;
    var changeLat = degToRad(storedBet.lat - user.lat);
    var changeLng = degToRad(storedBet.lng - user.lng);

    var a = Math.sin(changeLat / 2) * Math.sin(changeLat / 2) + Math.cos(degToRad(storedBet.lat)) * Math.cos(degToRad(user.lat)) * Math.sin(changeLng / 2) * Math.sin(changeLng / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return RAD_EARTH * c;
}

function degToRad(deg) {
    return deg * (Math.PI / 180);

}
module.exports = calcDistance;

module.exports.betOn = betOn;
module.exports.getBets = getBets;
module.exports.validate = validate;
module.exports.sendEmail = sendEmail;
module.exports.createBet = createBet;
module.exports.createJwt = createJwt
module.exports.verifyJwt = verifyJwt;
module.exports.decideBet = decideBet;
module.exports.isSignedIn = isSignedIn;
module.exports.calcDistance = calcDistance;
module.exports.alreadyBetOn = alreadyBetOn;
module.exports.isValidBetID = isValidBetID;
module.exports.resetPassword = resetPassword;
module.exports.hasEnoughCoins = hasEnoughCoins;
module.exports.makeArticleBet = makeArticleBet;
module.exports.checkIfExisting = checkIfExisting;
module.exports.anonymiseBetData = anonymiseBetData;
module.exports.isPasswordCompromised = isPasswordCompromised;