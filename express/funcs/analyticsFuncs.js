var testBetsFinished = require('../models/testBetsFinished');
var testBets = require('../models/testBets');
var User = require('../models/users');


function getBettingHistory(targetUser) {
    return new Promise((resolve, reject) => {
        testBetsFinished.find({}, (err, bets) => {
            if (err) {
                reject(err)
            }
            let betHistory = [];

            if (bets) {
                for (bet of bets) {
                    let betHistoryObj = {
                        profitOrLoss: -91029384756,
                        date: 1583428199297,
                    }
                    if (bet.type === "multi") {

                        if (bet.winners[0].user_name === targetUser) {
                            console.log
                            betHistoryObj["profitOrLoss"] = Math.floor(bet.commonTotal * bet.firstPlaceCut);
                            betHistoryObj["date"] = bet.deadline;
                            betHistory.push(betHistoryObj);


                        }

                        if (bet.winners[1].user_name === targetUser) {
                            betHistoryObj["profitOrLoss"] = Math.floor(bet.commonTotal * bet.secondPlaceCut);
                            betHistoryObj["date"] = bet.deadline;
                            betHistory.push(betHistoryObj);


                        }

                        if (bet.winners[2].user_name === targetUser) {
                            betHistoryObj["profitOrLoss"] = Math.floor(bet.commonTotal * bet.thirdPlaceCut);
                            betHistoryObj["date"] = bet.deadline;
                            betHistory.push(betHistoryObj);
                        }

                        // if they didn't win
                        if (betHistory.length == 0) {
                            for (indivBet of bet.commonBets) {
                                if (indivBet.user_name === targetUser) {
                                    betHistoryObj["profitOrLoss"] = Math.floor((-1) * indivBet.betAmount);
                                }
                            }
                            betHistoryObj["date"] = bet.deadline;
                            betHistory.push(betHistoryObj);
                        }
                    } else {
                        // bet type is binary
                        for (indivBet of bet.winners) {
                            // console.log(`winner ${indivBet.user_name}`)
                            if (indivBet.user_name === targetUser) {
                                // console.log("winning log found");
                                // console.log(indivBet)
                                if (bet.result === "yes") {
                                    for (indivBet2 of bet.forUsers) {
                                        if (indivBet2.user_name === targetUser) {
                                            // console.log(`the bet ${indivBet2}`)
                                            const percentage = Math.floor((indivBet2.betAmount / bet.forTotal));
                                            betHistoryObj["profitOrLoss"] = percentage * bet.againstTotal;
                                            betHistoryObj["date"] = bet.deadline;
                                            betHistory[0] = betHistoryObj;

                                        }
                                    }
                                } else {
                                    console.log("no")
                                        // result is no
                                    for (indivBet2 of bet.againstUsers) {
                                        if (indivBet2.user_name === targetUser) {
                                            betHistoryObj["profitOrLoss"] = Math.floor((indivBet2.betAmount / indivBet.againstTotal) * indivBet.forTotal);
                                            betHistoryObj["date"] = bet.deadline;
                                            betHistory[0] = betHistoryObj;

                                        }
                                    }
                                }
                            }
                        }
                        // if not in winners, they lost
                        for (indivBet of bet.losers) {

                            // console.log(`winner ${indivBet.user_name}`)
                            if (indivBet.user_name === targetUser) {

                                for (indivBet2 of bet.forUsers) {
                                    if (indivBet2.user_name === targetUser) {
                                        betHistoryObj["profitOrLoss"] = (-1) * indivBet2.betAmount
                                        betHistoryObj["date"] = bet.deadline;
                                        betHistory.push(betHistoryObj);

                                    }
                                }

                                // result is no
                                for (indivBet2 of bet.againstUsers) {
                                    if (indivBet2.user_name === targetUser) {
                                        betHistoryObj["profitOrLoss"] = (-1) * indivBet2.betAmount
                                        betHistoryObj["date"] = bet.deadline;
                                        betHistory.push(betHistoryObj);
                                    }
                                }

                            }
                        }
                    }
                }
                if (betHistory.length < 1) {
                    resolve(null);
                } else {
                    if (betHistory[0].profitOrLoss == -91029384756) {
                        // this is the default value, if it's there it means
                        // there were no bets found
                        resolve(null);
                    } else {
                        resolve(betHistory);
                    }
                }

            } else {
                resolve(null);
            }
        });
    });
}

function getCreatedBettingHistory(targetUser) {
    return new Promise((resolve, reject) => {
        testBetsFinished.find({}, (err, bets) => {
            if (err) {
                reject(err)
            }
            let betHistory = [];

            if (bets) {
                for (bet of bets) {
                    let betHistoryObj = {
                        profitOrLoss: -91029384756,
                        date: 1583428199297,
                    }
                    if (bet.type === "multi") {

                        if (bet.user_name === targetUser) {
                            betHistoryObj["profitOrLoss"] = Math.floor(bet.commonTotal * 0.1);
                            betHistoryObj["date"] = bet.deadline;
                            betHistory.push(betHistoryObj);
                        }
                    } else {
                        if (bet.user_name === targetUser) {
                            betHistoryObj["profitOrLoss"] = Math.floor(0.1 * (bet.forTotal + bet.againstTotal))
                            betHistoryObj["date"] = bet.deadline;
                            betHistory.push(betHistoryObj);
                        }
                    }
                }
                if (betHistory.length < 1) {
                    resolve(null);
                } else {
                    if (betHistory[0].profitOrLoss == -91029384756) {
                        // this is the default value, if it's there it means
                        // there were no bets found
                        resolve(null);
                    } else {
                        resolve(betHistory)
                    }
                }

            } else {
                resolve(null);
            }
        });
    });
}

module.exports.getBettingHistory = getBettingHistory;
module.exports.getCreatedBettingHistory = getCreatedBettingHistory;