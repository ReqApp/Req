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
                        profitOrLoss: 0,
                        date: 1583428199297,
                    }
                    if (bet.type === "multi") {

                        if (bet.winners[0].user_name === targetUser) {
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
                    }
                }
                resolve(betHistory);
            } else {
                resolve(null);
            }
        });
    });
}

module.exports.getBettingHistory = getBettingHistory;