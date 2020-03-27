var forgotPasswordUser = require('../models/forgotPasswordUsers');
var betsFinished = require('../models/betsFinished');
var UnverifiedUser = require('../models/unverifiedUsers');
var generalFuncs = require('../funcs/generalFuncs');
const keccak512 = require('js-sha3').keccak512;
var bets = require('../models/bets');
var User = require('../models/users');
var BetRegion = require('../models/betRegions');
var LocationBet = require('../models/locationBetData');
var jwt = require('jsonwebtoken');
const axios = require("axios");


function getBets() {
    return new Promise((resolve, reject) => {
        bets.find({}, (err, response) => {
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
            if (parseFloat(input) == NaN) {
                return false;
            } else {
                return true;
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
            if (!input) {
                return false;
            }
            if (input.length < 32 && input.length > 0) {
                return true;
            } else {
                return false;
            }
        case 'action':
            if (input == "end" || input === "start") {
                return true;
            } else {
                return false;
            }
        case 'type':
            if (!input) {
                return false;
            }
            if (input === "multi" || input === "binary") {
                return true;
            }
            return false;
        case 'url':
            let test2 = conditions.some(el => input.includes(el));
            if (test2) {
                return false;
            } else {
                return true;
            }
        case 'title':
            if (!input) {
                return false;
            }
            if (input.length > 1 && input.length < 64) {
                if (input.match(/([^A-Za-z0-9, ]+)/g)) {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
    }
}

function betOn(userObj) {
    return new Promise((resolve, reject) => {
        if (userObj.type === "binary") {
            if (userObj.side === "yes") {
                bets.findOneAndUpdate({ _id: userObj.betID }, { $push: { forUsers: { user_name: userObj.username, betAmount: userObj.betAmount } } },
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
                bets.findOneAndUpdate({ _id: userObj.betID }, { $push: { againstUsers: { user_name: userObj.username, betAmount: userObj.betAmount } } },
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
            bets.findOneAndUpdate({ _id: userObj.betID }, { $push: { commonBets: { user_name: userObj.username, betAmount: userObj.betAmount, bet: userObj.bet } } },
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
            console.log("poggers")
            reject("Incorrect bet typee");
        }
    })
}

function alreadyBetOn(userObj) {
    return new Promise((resolve, reject) => {
        if (userObj.type === "binary") {
            bets.findOne({ _id: userObj.betID }, (err, res) => {
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
            bets.findOne({ _id: userObj.betID }, (err, res) => {
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
                } else {
                    reject("Invalid username")
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
        bets.deleteOne({ _id: betID }, (err) => {
            if (err) {
                console.log(`delete err ${err}`);
                reject(err);
            } else {
                console.log(`delete success`);
                resolve(true);
            }
        })
    })
}

function decideBet(inputObj) {
    return new Promise((resolve, reject) => {
        let badBet = false;
        bets.findOne({ _id: inputObj.betID }, (err, foundBet) => {

            if (err) {
                reject(err);
            }
            if (foundBet) {
                // currTime - deadline + 24 hours

                if (inputObj.expired) {
                    badBet = true;
                    // take off 1% of their wealth
                    generalFuncs.getCoins(foundBet.user_name).then((coinAmount) => {
                        if (coinAmount) {
                            payOut(foundBet.user_name, -0.01, coinAmount).then((response) => {
                                if (response) {
                                    console.log(`Deducted ${response} from ${foundBet.user_name}`);
                                } else {
                                    resolve(null);
                                }
                            }, (err) => {
                                reject(err);
                            });
                        } else {
                            resolve(null);
                        }
                    });

                    expiredBetPayBack(foundBet).then((response) => {
                        if (resposne) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }, (err) => {
                        console.log
                        reject(err)
                    })
                }



                if (!badBet) {
                    console.log("not bad bet")
                    anonymiseBetData([foundBet]).then((betData) => {
                        if (betData) {
                            if (foundBet.type === "binary") {

                                if (!(inputObj.result === "yes" || inputObj.result === "no")) {
                                    reject("Invalid result given")
                                }
                                const againstTotal = parseInt(betData[0].againstBetTotal, 10);
                                const forTotal = parseInt(betData[0].forBetTotal, 10);

                                // if there was a bet in either for or against and not in the other
                                if ((foundBet.forUsers.length > 0 && foundBet.againstUsers.length == 0 && foundBet.commonBets.length == 0)) {
                                    console.log("only one in for")
                                    badBet = true;
                                    // this was a one sided bet,
                                    // give the money back
                                    for (bet of foundBet.forUsers) {
                                        payOut(bet.user_name, 1, bet.betAmount).then((response) => {
                                            if (response) {
                                                console.log(`Paid back ${response} to ${bet.user_name}`);
                                            } else {
                                                console.log(`Couldn't pay back ${response} to ${bet.uesr_name}`)
                                            }
                                        })
                                    }
                                    deleteBet(inputObj.betID).then((response) => {
                                        if (response) {
                                            resolve(true);
                                        }
                                    }, (err) => {
                                        reject(err);
                                    })
                                    resolve(null);
                                }


                                if ((foundBet.againstUsers.length > 0 && foundBet.forUsers.length == 0 && foundBet.commonBets.length == 0)) {
                                    console.log("only one in against")
                                    badBet = true;
                                    for (bet of foundBet.againstUsers) {
                                        payOut(bet.user_name, 1, bet.betAmount).then((response) => {
                                            if (response) {
                                                console.log(`Paid back ${response} to ${bet.user_name}`);
                                            } else {
                                                console.log(`Couldn't pay back ${response} to ${bet.uesr_name}`)
                                            }
                                        })
                                    }
                                    deleteBet(inputObj.betID).then((response) => {
                                        if (response) {
                                            resolve(true);
                                        }
                                    }, (err) => {
                                        reject(err);
                                    })
                                    resolve(null);
                                }


                                // pay out 10% of total bets to the bet creator first
                                payOut(foundBet.user_name, 0.1, againstTotal + forTotal).then(() => {});

                                if (inputObj.result === "yes") {
                                    // if yes wins
                                    if (foundBet.forUsers.length > 0) {
                                        for (bet of foundBet.forUsers) {

                                            let payPercentage = (bet.betAmount / parseInt(betData[0].forBetTotal, 10));

                                            payOut(bet.user_name, payPercentage, betData[0].againstBetTotal).then((response) => {
                                                if (response) {
                                                    console.log(`Paid out ${Math.floor(response) } to ${bet.user_name} successfully`);
                                                } else {
                                                    console.log(`Paid out 0 unsuccessfully`);
                                                }

                                                addBetToFinishedDB(foundBet, foundBet.forUsers, foundBet.againstUsers, betData[0], "yes").then((added) => {
                                                    if (added) {
                                                        console.log(`Added bet to finished DB`);
                                                        resolve(true);
                                                    } else {
                                                        console.log("resovled null for adding to")
                                                        resolve(null);
                                                    }
                                                }, (err) => {
                                                    reject(err);
                                                })

                                                // if paid out anything or nothing, still delete the bet
                                                deleteBet(inputObj.betID).then((response) => {
                                                    if (response) {
                                                        resolve(true);
                                                    } else {
                                                        resolve(null);
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

                                                addBetToFinishedDB(foundBet, foundBet.againstUsers, foundBet.forUsers, betData[0], "no").then((added) => {
                                                    if (!added) {
                                                        reject("Couldn't save bet to finished DB");
                                                    }
                                                }, (err) => {
                                                    reject(err);
                                                })

                                                //    if paid out anything or nothing, still delete the bet
                                                deleteBet(inputObj.betID).then((response) => {
                                                    if (response) {
                                                        resolve(true);
                                                    } else {
                                                        resolve(null);
                                                    }
                                                }, (err) => {
                                                    reject(err);
                                                })
                                                resolve(true);
                                            }, (err) => {
                                                reject(err);
                                            })
                                        }
                                    } else {
                                        // there were no users betting against
                                        // payout back the original amounts paid in
                                        resolve(null);
                                    }
                                }
                            } else if (foundBet.type === "multi") {
                                // if there were any bets at all, pay out to them
                                if (foundBet.commonBets.length > 1) {
                                    console.log("more than 1 common")
                                    rankAnswers(foundBet.commonBets, parseInt(inputObj.result, 10)).then((sortedAnswers) => {
                                        // sort the answers based on their difference to the actual result
                                        if (sortedAnswers) {

                                            if (sortedAnswers.length == 1) {
                                                // there was one 1 bet made, pay them back what they put in
                                                // creator does not get paid because then they could get 10% of fake winnings every time
                                                payOut(sortedAnswers[0].user_name, 1, foundBet.commonBets[0].betAmount).then((response) => {
                                                    if (response) {
                                                        console.log(`Paid out ${response} to ${sortedAnswers[0].user_name} successfully [no other bets]`);

                                                        addBetToFinishedDB(foundBet, sortedAnswers, sortedAnswers, betData[0], inputObj.result).then((added) => {
                                                            if (added) {
                                                                console.log(`Added bet to finished DB`);
                                                            } else {
                                                                console.log(`Didn't add bet to finished DB`)
                                                            }
                                                        }, (err) => {
                                                            reject(err);
                                                        })

                                                        // if paid out anything or nothing, still delete the bet
                                                        deleteBet(inputObj.betID).then((response) => {
                                                            if (response) {
                                                                resolve(true);
                                                            } else {
                                                                resolve(null);
                                                            }
                                                        }, (err) => {
                                                            reject(err);
                                                        })
                                                        resolve(true);
                                                    } else {
                                                        console.log(`Error paying out ${response} to ${sortedAnswers[0].user_name} [no other bets]`);
                                                        resolve(null);
                                                    }
                                                });
                                            } else {
                                                // there was more than 1 person who made a bet on this post
                                                payOut(sortedAnswers[0].user_name, foundBet.firstPlaceCut, betData[0].betsTotal).then((response) => {
                                                    if (response) {
                                                        console.log(`Paid out ${response} to ${sortedAnswers[0].user_name} successfully`);
                                                    } else {
                                                        console.log(`Error paying out ${response} to ${sortedAnswers[0].user_name}`);
                                                        resolve(null);
                                                    }
                                                })
                                                if (sortedAnswers.length > 1) {
                                                    payOut(sortedAnswers[1].user_name, foundBet.secondPlaceCut, betData[0].betsTotal).then((response) => {
                                                        if (response) {
                                                            console.log(`Paid out ${response} to ${sortedAnswers[1].user_name} successfully`);
                                                        } else {
                                                            console.log(`Error paying out ${response} to ${sortedAnswers[1].user_name}`);
                                                            resolve(null);
                                                        }
                                                    })
                                                }

                                                if (sortedAnswers.length > 2) {
                                                    payOut(sortedAnswers[2].user_name, foundBet.thirdPlaceCut, betData[0].betsTotal).then((response) => {
                                                        if (response) {
                                                            console.log(`Paid out ${response} to ${sortedAnswers[2].user_name} sucessfully`);
                                                        } else {
                                                            console.log(`Error paying out ${response} to ${sortedAnswers[2].user_name}`);
                                                            resolve(null);
                                                        }
                                                    })
                                                }

                                                // payout to the bet creator 
                                                payOut(foundBet.user_name, 0.1, betData[0].betsTotal).then((response) => {
                                                    console.log(`Paid out ${response} to creator ${foundBet.user_name}`);
                                                }, (err) => {
                                                    reject(err);
                                                })


                                                addBetToFinishedDB(foundBet, sortedAnswers, sortedAnswers, betData[0], inputObj.result).then((added) => {
                                                    if (added) {
                                                        console.log(`Added bet to finished DB`);
                                                    } else {
                                                        console.log(`Didn't add bet to finished DB`)
                                                    }
                                                }, (err) => {
                                                    console.log(`err ${err}`);
                                                    reject(err);
                                                });

                                                // if paid out anything or nothing, still delete the bet
                                                deleteBet(inputObj.betID).then((response) => {
                                                    if (response) {
                                                        resolve(true);
                                                    } else {
                                                        resolve(null);
                                                    }
                                                }, (err) => {
                                                    reject(err);
                                                })
                                            }
                                        } else {
                                            resolve(false);
                                        }

                                    });
                                } else {

                                    console.log("less than 1 in common bets and badbet=" + badBet);

                                    for (bet of foundBet.commonBets) {
                                        console.log(" ")
                                        console.log("BET: ")
                                        console.log(bet)
                                        payOut(bet.user_name, 1, bet.betAmount).then((response) => {
                                            if (response) {
                                                console.log(`Paid back ${response} to ${bet.user_name}`);
                                            } else {
                                                console.log(`Couldn't pay back ${response} to ${bet.uesr_name}`)
                                            }
                                        })
                                    }

                                    deleteBet(inputObj.betID).then((response) => {
                                        if (response) {
                                            resolve(true);
                                        }
                                    }, (err) => {
                                        reject(err);
                                    })
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
        allBets.sort(function(a, b) {
            if (Math.abs(a.bet - result) > Math.abs(b.bet - result)) {
                return 1;
            }
            if (Math.abs(a.bet - result) < Math.abs(b.bet - result)) {
                return -1
            }
            return 0;
        })
        resolve(allBets);
    });
}

function expiredBetPayBack(foundBet) {
    return new Promise((resolve, reject) => {
        if (foundBet.type == "binary") {

            // if it was a one sided bet
            if ((foundBet.forUsers.length > 0 && foundBet.againstUsers.length == 0 && foundBet.commonBets.length == 0)) {
                console.log("only one in for")
                badBet = true;
                // this was a one sided bet,
                // give the money back
                for (bet of foundBet.forUsers) {
                    payOut(bet.user_name, 1, bet.betAmount).then((response) => {
                        if (response) {
                            console.log(`Paid back ${response} to ${bet.user_name}`);
                        } else {
                            console.log(`Couldn't pay back ${response} to ${bet.uesr_name}`)
                        }
                    })
                }
                deleteBet(inputObj.betID).then((response) => {
                    if (response) {
                        resolve(true);
                    }
                }, (err) => {
                    reject(err);
                })
                resolve(null);
            }


            if ((foundBet.againstUsers.length > 0 && foundBet.forUsers.length == 0 && foundBet.commonBets.length == 0)) {
                console.log("only one in against")
                badBet = true;
                for (bet of foundBet.againstUsers) {
                    payOut(bet.user_name, 1, bet.betAmount).then((response) => {
                        if (response) {
                            console.log(`Paid back ${response} to ${bet.user_name}`);
                        } else {
                            console.log(`Couldn't pay back ${response} to ${bet.uesr_name}`)
                        }
                    })
                }
                deleteBet(inputObj.betID).then((response) => {
                    if (response) {
                        resolve(true);
                    }
                }, (err) => {
                    reject(err);
                })
                resolve(null);
            }

            // was a regular bet, pay them all back
        } else {
            if (foundBet.commonBets.length > 0) {

                for (bet of foundBet.commonBets) {
                    payOut(bet.user_name, 1, bet.betAmount).then((response) => {
                        if (response) {
                            console.log(`Paid back ${response} to ${bet.user_name}`);
                        } else {
                            console.log(`Couldn't pay back ${response} to ${bet.uesr_name}`)
                        }
                    })
                }
            }

            sleep(4000);
            resolve(true);
        }
    })
}

function addBetToFinishedDB(betInfo, winners, losers, betSummary, result) {
    return new Promise((resolve, reject) => {
        let winnersArr = []
        let losersArr = []

        if (betInfo.type === "multi") {
            // only show top 3 if it was a mutli bet since
            // only they got a money payout
            for (i = 0; i < winners.length; i++) {
                if (i != 3) {
                    winnersArr.push(winners[i]);
                }
                if (i >= 3) {
                    losersArr.push(winners[i])
                }
            }
        } else {
            // if a binary bet, send on everyone
            for (win of winners) {
                winnersArr.push(win);
            }
            for (lose of losers) {
                losersArr.push(lose);
            }
        }

        newBet = new betsFinished({
            user_name: betInfo.user_name,
            title: betInfo.title,
            type: betInfo.type,
            side: betInfo.side,
            deadline: betInfo.deadline,
            forUsers: betInfo.forUsers,
            againstUsers: betInfo.againstUsers,
            commonBets: betInfo.commonBets,
            firstPlaceCut: betInfo.firstPlaceCut,
            secondPlaceCut: betInfo.secondPlaceCut,
            thirdPlaceCut: betInfo.thirdPlaceCut,
            commonTotal: betSummary.betsTotal,
            winners: winnersArr,
            losers: losersArr,
            result: result
        });

        console.log(newBet);


        newBet.save((err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}


function resetPassword(email, newPassword) {
    return new Promise((resolve, reject) => {
        User.findOne({ email: email }, (err, foundUser) => {
            if (err) {
                res.send(err);
            }
            if (foundUser) {
                foundUser.password = foundUser.generateHash(newPassword);
                foundUser.save((err) => {
                    if (err) {
                        res.send(err);
                        reject(Error(err));
                    } else {
                        console.log("password changed");
                        resolve(foundUser.user_name);
                    }
                });
            }
        });
    });
}

function isValidBetID(betID) {
    return new Promise((resolve, reject) => {
        if (betID) {
            bets.findOne({ _id: betID }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    if (res) {
                        resolve(res);
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
                    againstBetTotal: againstTotal,
                    numberOfBettors : indivBet.forUsers.length + indivBet.againstUsers.length,
                    betID: indivBet._id,
                    type: indivBet.type
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
                    betsTotal: commonTotal,
                    firstPlaceCut : indivBet.firstPlaceCut,
                    secondPlaceCut : indivBet.secondPlaceCut,
                    thirdPlaceCut : indivBet.thirdPlaceCut,
                    numberOfBettors : indivBet.commonBets.length,
                    betID: indivBet._id,
                    type: indivBet.type
                }
                betArr.push(tempBet);
            }
        }
        resolve(betArr);
    });
}

// TODO implement location bet check
// Returns bets not yet bet on or created by user
function findNewBets(user_name){
    return new Promise((resolve, reject) => {
        let newBets = [];
        getBets().then(bets => {
            if(bets){
                bets.forEach(bet => {
                    let found = false;
                    let userCreated = false;
                    if(bet.user_name === user_name){
                        userCreated = true;
                    }
                    if(bet.type === 'binary' && !userCreated){
                        if(bet.forUsers.find(user => user.user_name === user_name)){
                            found = true;
                        }
                        if(bet.againstUsers.find(user => user.user_name === user_name)){
                            found = true;
                        }
                        if(!found){
                            newBets.push(bet);
                        }
                    }
                    else if(!userCreated){
                        if(bet.commonBets.find(user => user.user_name === user_name)){
                            ;;
                        }
                        else{
                            newBets.push(bet);
                        }
                    }

                })
            }
            resolve(newBets);
        }, err => {
            reject(err);
        });
    });
}

function getUserCreatedBets(user_name){
    return new Promise((resolve, reject) => {
        let userBets = [];
        getBets().then(bets => {
            bets.forEach(bet => {
                if(bet.user_name === user_name){
                    userBets.push(bet);
                }
            }, err => {
                reject(err);
            })
            anonymiseBetData(userBets).then(res => {
                resolve(res);
            });
        });
    });
}

function getBetsForUser(data, user_name){
    return new Promise((resolve, reject) => {
        let anonBets = [];
        let userAmounts = [];
        let betValues = [];
        data.forEach(element => {
            if(element.type === 'binary'){
                let flag = true;
                element.forUsers.forEach(user => {
                    if(user.user_name === user_name){
                        userAmounts.unshift(user.betAmount);
                        betValues.push('For');
                        anonBets.push(element.toObject());
                        flag = false;
                    }         
                });
                if(flag){
                    element.againstUsers.forEach(user => {
                        if(user.user_name === user_name){
                            userAmounts.unshift(user.betAmount);
                            betValues.push('Against');
                            anonBets.push(element.toObject());
                        }
                    });
                }
            }
            else if(element.type === 'multi'){
                element.commonBets.forEach(user => {
                    if(user.user_name === user_name){
                        userAmounts.unshift(user.betAmount);
                        betValues.push(user.bet);
                        anonBets.push(element.toObject());
                    }
                });
            }
        });
        anonymiseBetData(anonBets).then(res => {
            if(res){
                for(let i = 0; i < res.length; i++){
                    res[i].userAmount = userAmounts[i];
                    res[i].betValue = betValues[i];
                }
                resolve(res);
            }else{
                resolve(null);
            }
        });

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
            if (input.title && input.deadline && input.username) {

                let newBet = new bets();

                newBet.title = input.title;
                newBet.side = input.side;
                newBet.deadline = input.deadline;
                newBet.user_name = input.username;
                newBet.type = input.type;

                newBet.save((err, bet) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(bet);
                    }
                });

            } else {
                resolve(false);
            }
        } else if (input.type === "multi") {

            if (input.title && input.deadline && input.username && input.firstPlaceCut != null &&
                input.secondPlaceCut != null && input.thirdPlaceCut != null) {
                let newBet = new bets();

                newBet.title = input.title;
                newBet.deadline = input.deadline;
                newBet.user_name = input.username;
                newBet.type = input.type;
                newBet.firstPlaceCut = input.firstPlaceCut;
                newBet.secondPlaceCut = input.secondPlaceCut;
                newBet.thirdPlaceCut = input.thirdPlaceCut;

                newBet.save((err, bet) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(bet);
                    }
                });

            } else {
                resolve(false);
            }
        } else {
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
        const child = require('child_process').execFile;
        const execPath = "./emailService/sendEmail";
        const params = [email, subject, body];
        child(execPath, params, (err, data) => {
            if (err) {
                console.log(err)
                reject(err);
            }
            if (data) {
                resolve(true);
            } else {
                resolve(false);
            }
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

function createLocationBet(data) {
    return new Promise((resolve, reject) => {
        let locationBet = new LocationBet(data);
        locationBet.save((err, savedBet) => {
            if (err) {
                reject(err);
            } else {
                addLocationBetToRegion(savedBet.bet_region_id, savedBet._id).then(response => {
                    resolve(savedBet);
                }, err => {
                    reject(err);
                });
            }
        });
    });
}

function addLocationBetToRegion(regionID, locationBetID) {
    return new Promise((resolve, reject) => {
        BetRegion.findOneAndUpdate({ '_id': regionID }, { '$push': { 'bet_ids': locationBetID }, '$inc': { 'num_bets': 1 } }, { useFindAndModify: false }).exec((err, region) => {
            if (err) {
                reject(err);
            } else {
                resolve(region);
            }
        });
    });
}

function createRegion(data) {
    return new Promise((resolve, reject) => {
        let region = BetRegion(data);
        region.save((err, savedRegion) => {
            if (err) {
                reject(err);
            } else {
                resolve(savedRegion);
            }
        });
    });
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
module.exports.createLocationBet = createLocationBet;
module.exports.createRegion = createRegion;
module.exports.alreadyBetOn = alreadyBetOn;
module.exports.isValidBetID = isValidBetID;
module.exports.resetPassword = resetPassword;
module.exports.hasEnoughCoins = hasEnoughCoins;
module.exports.checkIfExisting = checkIfExisting;
module.exports.anonymiseBetData = anonymiseBetData;
module.exports.expiredBetPayBack = expiredBetPayBack;
module.exports.isPasswordCompromised = isPasswordCompromised;
module.exports.getBetsForUser = getBetsForUser;
module.exports.findNewBets = findNewBets;
module.exports.getUserCreatedBets = getUserCreatedBets;