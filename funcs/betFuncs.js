var testBets = require('../models/testBets');
var User = require('../models/users');
var jwt = require('jsonwebtoken');


function getBets() {
    return new Promise((resolve, reject) => {
        testBets.find({}, (err, response) => {
            if (err) {
                reject(err);
            } else {
                if (response) {
                    resolve(response);
                } else {
                    resolve(null);
                }
            }
        })
    });
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
        User.findOne({user_name:username}, (err, foundUser) => {
            if (err) {
                reject(err);
            }
            if (foundUser) {
                foundUser.coins += Math.floor(percentage * winnings);
                foundUser.save((err) => {
                    reject(err);
                });
    
                resolve(percentage*winnings);
            } else {
                resolve(null);
            }
        })
    })
}

function deleteBet(betID) {
    return new Promise((resolve, reject) => {
        testBets.deleteOne({_id:betID}, (err) => {
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
    
        testBets.findOne({_id:inputObj.betID}, (err, foundBet) => {
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
                            const againstTotal = parseInt(betData[0].againstBetTotal,10);
                            const forTotal = parseInt(betData[0].forBetTotal, 10);

                            payOut(foundBet.user_name, 0.1, againstTotal + forTotal).then(() => {
                            });

                            if (inputObj.result === "yes") {
                                // if yes wins
                                if (foundBet.forUsers.length > 0) {
                                    for (bet of foundBet.forUsers) {

                                        let payPercentage = ( bet.betAmount / parseInt(betData[0].forBetTotal,10) );

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

                                    let payPercentage = ( bet.betAmount / parseInt(betData[0].againstBetTotal,10) );
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
            } else  {
                resolve(null);
            }
        });
    })
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

function validate(input, type) {
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
    }
}

function verifyJwt(jwtString) {
    val = jwt.verify(jwtString, process.env.JWTSECRET);
    return val;
}

module.exports.betOn = betOn;
module.exports.getBets = getBets;
module.exports.validate = validate;
module.exports.createBet = createBet;
module.exports.verifyJwt = verifyJwt;
module.exports.decideBet = decideBet;
module.exports.isSignedIn = isSignedIn;
module.exports.alreadyBetOn = alreadyBetOn;
module.exports.isValidBetID = isValidBetID;
module.exports.hasEnoughCoins = hasEnoughCoins;
module.exports.anonymiseBetData = anonymiseBetData;