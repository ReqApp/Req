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
            if (parseFloat(input) !== NaN) {
                return true;
            } else {
                return false;
            }
            return true;
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
        if (userObj.type === "binary") {
            if (userObj.side === "yes") {
                testBets.findOneAndUpdate({ _id: userObj.betID }, { $push: { forUsers: { user_name: userObj.username, betAmount: userObj.betAmount } } },
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
                testBets.findOneAndUpdate({ _id: userObj.betID }, { $push: { againstUsers: { user_name: userObj.username, betAmount: userObj.betAmount } } },
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
        } else if (userObj.type === "multi") {
            testBets.findOneAndUpdate({_id:userObj.betID}, { $push: { commonBets: {user_name: userObj.username, betAmount: userObj.betAmount, bet: userObj.bet } } },
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                }) 
        } else {
            reject("Incorrect bet type");
        }
    })
}

function alreadyBetOn(userObj) {
    return new Promise((resolve, reject) => {
        if (userObj.type === "binary") {
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
        } else if (userObj.type === "multi") {
            testBets.findOne({_id: userObj.betID}, (err, res) => {
                if (err) {
                    reject(err);
                } 
                if (res) {
                    for (indivBet of res.commonBets) {
                        if (indivBet.user_name === userObj.username) {
                            resolve(true);
                        }
                    }
                    resolve(null);
                } else {
                    reject("Invalid betID");
                }
            });
        } else {
            reject("Incorrect bet type");
        }
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

                resolve(Math.floor(percentage * winnings));
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
        testBets.findOne({ _id: inputObj.betID }, (err, foundBet) => {
            if (err) {
                reject(err);
            }
            if (foundBet) {
                // currTime - deadline + a fair bit of time
                if (new Date().getTime() - (foundBet.deadline + 21600000) >= 0) {
                    reject("Deadline has been exceeded");
                } else {
                    // not expired, dish out the winnings
                    anonymiseBetData([foundBet]).then((betData) => {
                        if (betData) {
                            if (foundBet.type === "binary") {
                            // payout to the setter
                            const againstTotal = parseInt(betData[0].againstBetTotal, 10);
                            const forTotal = parseInt(betData[0].forBetTotal, 10);
                            
                            // pay out 10% of total bets to the bet creator first
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
                                    // there were no users betting for
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
                                    // there were no users betting against
                                    resolve(null);
                                }
                            }
                        } else if (foundBet.type === "multi") {
                            // if there were any bets at all, pay out to them
                            if (foundBet.commonBets.length > 0) {
                                rankAnswers(foundBet.commonBets, parseInt(inputObj.result,10)).then((sortedAnswers) => {
                                    // sort the answers based on their difference to the actual result
                                    if (sortedAnswers) {
                                        payOut(sortedAnswers[0].user_name,foundBet.firstPlace,betData[0].betsTotal).then((response) => {
                                            if (response) {
                                                console.log(`Paid out ${response} to ${sortedAnswers[0].user_name} successfully`);
                                            } else {
                                                console.log(`Error paying out ${response} to ${sortedAnswers[0].user_name}`);
                                                resolve(null);
                                            }
                                        })
                                        if (sortedAnswers.length > 1) {
                                            payOut(sortedAnswers[1].user_name,foundBet.secondPlace,betData[0].betsTotal).then((response) => {
                                                if (response) {
                                                    console.log(`Paid out ${response} to ${sortedAnswers[1].user_name} successfully`);
                                                } else {
                                                    console.log(`Error paying out ${response} to ${sortedAnswers[1].user_name}`);
                                                    resolve(null);
                                                }
                                            })
                                        }

                                        if (sortedAnswers.length > 2) {
                                            payOut(sortedAnswers[2].user_name, foundBet.thirdPlace,betData[0].betsTotal).then((response) => {
                                                if (response) {
                                                    console.log(`Paid out ${response} to ${sortedAnswers[2].user_name} sucessfully`);
                                                } else {
                                                    console.log(`Error paying out ${response} to ${sortedAnswers[2].user_name}`);
                                                    resolve(null);
                                                }
                                            }) 
                                        }
                                        // payout to the bet creator 
                                        payOut(foundBet.user_name, 0.1, betData[0].betsTotal).then(() => {
                                            deleteBet(inputObj.betID).then((response) => {
                                                if (response) {
                                                    resolve(true);
                                                }
                                            }, (err) => {
                                                reject(err);
                                            });
                                        });
    
                                    } else {
                                        resolve(false);
                                    }
    
                                });
                            } else {
                                // There were no bets  placed
                                resolve(true);
                            }
                          
                        } else {
                            reject("Incorrect bet type given");
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

function rankAnswers(allBets, result) {
    return new Promise((resolve, reject) => {
        if (allBets.length < 1 || allBets === undefined) {
            resolve(false);
        }
        allBets.sort(function(a,b) {
            if (a.bet < result) {
                return 1;
            } 
            if (a.bet > result) {
                return -1
            }
            return 0;
        })
        resolve(allBets);
    });
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
                reject(null);
            }
        } else {
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
            let commonTotal = 0;

            if (indivBet.type === "binary") {
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
            } else if (indivBet.type === "multi") {

                if (indivBet.commonBets.length > 0) {
                    for (bet of indivBet.commonBets) {
                        commonTotal += bet.betAmount
                    }
                }
                let tempBet = {
                    title: indivBet.title,
                    username: indivBet.user_name,
                    deadline: indivBet.deadline,
                    betsTotal: commonTotal
                }
                betArr.push(tempBet);
            }
        }
        resolve(betArr);
    });
}

function isSignedIn(reqCookies) {
    return new Promise((resolve, reject) => {
        if (reqCookies.Authorization) {
            let jwt = reqCookies.Authorization.split(' ')[1];
            const profile = verifyJwt(jwt);
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
        if (input.type === "binary") {
            if (input.title && input.side && input.deadline && input.username) {
                let newBet = new testBets();
    
                newBet.title = input.title;
                newBet.side = input.side;
                newBet.deadline = input.deadline;
                newBet.user_name = input.username;
                newBet.type= input.type;

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
        } else if (input.type === "multi") {
            if (input.title && input.deadline && input.username && input.firstPlace &&
                input.secondPlace && input.thirdPlace) {
                let newBet = new testBets();
    
                newBet.title = input.title;
                newBet.deadline = input.deadline;
                newBet.user_name = input.username;
                newBet.type= input.type;
                newBet.firstPlace = input.firstPlace;
                newBet.secondPlace = input.secondPlace;
                newBet.thirdPlace = input.thirdPlace;
    
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
        } else {
            console.log("wasnt multi or binary")
            reject("Invalid bet type");
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
module.exports.rankAnswers = rankAnswers;
module.exports.calcDistance = calcDistance;
module.exports.alreadyBetOn = alreadyBetOn;
module.exports.isValidBetID = isValidBetID;
module.exports.resetPassword = resetPassword;
module.exports.hasEnoughCoins = hasEnoughCoins;
module.exports.makeArticleBet = makeArticleBet;
module.exports.checkIfExisting = checkIfExisting;
module.exports.anonymiseBetData = anonymiseBetData;
module.exports.isPasswordCompromised = isPasswordCompromised;