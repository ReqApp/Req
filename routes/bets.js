var jwt = require('jsonwebtoken');
var express = require('express');
var User = require('../models/users');
var router = express.Router();
var util = require('util');
var testBets = require('../models/testBets');

router.post('/makeBet', (req, res, next) => {
    
    let inputObj = {
        "title": req.body.title,
        "side": req.body.side,
        "amount": req.body.amount,
        "deadline": req.body.deadline,
        "username": req.body.username
    }

    hasEnoughCoins(req.body.username,  req.body.amount).then((data) => {
        if (data) {
            createBet(inputObj).then((response) => {
                if (response) {
                    res.status(200).json({
                        "status":"success",
                        "body":"Bet made!"
                    });
                } else {
                   res.status(400).json({
                       "status":"error",
                       "body":"Bet not made no res"
                   });
                }
            }, (err) => {
                console.log(err);
                res.status(400).json({
                    "status":"err",
                    "body":"ERR Bet not made"
                });
            })
        } else {
            console.log(`${inputObj.username} doesn't have enough coins`);
            res.status(400).json({
                "status":"error",
                "body":"Not enough coins"
            });
        }
    }, (err) => {
        res.status(400).json({
            "status":"error",
            "body":"Error retrieving coin amount"
        });
    });

});

router.post('/funk', (req, res, next) => {
    res.status(200).json({
        "status":"success"
    })
});

router.post('/betOn', (req, res, next) => {
    let inputObj = {
        "betID": req.body.betID,
        "username": req.body.username,
        "amount": req.body.amount,
        "side": req.body.side
    }

    isValidBetID(inputObj.betID).then((resp) => {
        if (resp) {
            hasEnoughCoins(req.body.username, req.body.amount).then((data) => {
                if (data) {
                    console.log(`${req.body.username} has enough coins`);
                    addToBet(inputObj).then((response) => {
                        if (response) {
                            res.status(200).json({
                                "status":"error",
                                "body":"Bet successfully added"
                            });
                        } else {
                            res.status(400).json({
                                "status":"error",
                                "body":"Bet could not be added"
                            });
                        }
                    }, (err) => {
                        res.status(400).json({
                            "status":"error",
                            "body":"Error adding bet to DB"
                        });
                    }); 
                } else {
                    res.status(400).json({
                        "status":"error",
                        "body":"Insufficient funds"
                    });
                }
            }, (err) => {
                res.status(400).json({
                    "status":"error",
                    "body":"Error retrieving coin amount"
                });
            })
        } else {
            res.status(400).json({
                "status":"error",
                "body":"Invalid betID"
            });
        }
    }, (err) => {
        res.status(400).json({
            "status":"error",
            "body":"Error validating bet ID"
        });
    })
})

// needs server side processing to anonymise the betting users before being sent back to the user
router.post('/getTestBets', (req, res, next) => {
  getBets().then((data) => {
      if (data) {
          anonymiseBetData(data).then((response) => {
              if (response) {
                res.status(200).json(response);
              } else {
                res.status(400).json({
                    "status":"error",
                    "body":"Error anonymising data nothing"
                });
              }
          }, (err) => {
            res.status(400).json({
                "status":"error",
                "body": "no bets to pull from: "+err
            });
          })
      } else {
          res.status(400).json({
              "status":"error",
              "body":"Could not get bets"
          });
      }
  }, (err) => {
      res.status(400).json({
          "status":"error",
          "body":"Error getting bets from DB"
      });
  })
});

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
            console.log(input);
            resolve(false);
        }
    })
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
                forBetTotal: forTotal,
                againstBetTotal: againstTotal
            }
            betArr.push(tempBet);
        }
        resolve(betArr);
    });
}

function isValidBetID(betID) {
    return new Promise((resolve, reject) => {
        testBets.findOne({_id:betID}, (err, res) => {
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
    });
}

function hasEnoughCoins(username, transactionAmount) {
    return new Promise((resolve, reject) => {
        console.log(username, transactionAmount);
        User.findOne({user_name:username}, (err, foundUser) => {
            if (err) {
                reject(err);
            } else {
                if (foundUser) {
                    if (foundUser.coins >= transactionAmount) {
                        foundUser.coins -= transactionAmount;
                        foundUser.save((err) => {
                            if(err) {
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

function addToBet(userObj) {
    return new Promise((resolve, reject) => {
        if (userObj.side === "yes") {
            testBets.findOneAndUpdate({_id:userObj.betID},
                {$push: {forUsers: {user_name:userObj.username, betAmount: userObj.amount}}},
                 (err, result) => {
                if (err) {
                    reject(err);
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
            testBets.findOneAndUpdate({_id:userObj.betID},
                {$push: {againstUsers: {user_name:userObj.username, betAmount: userObj.amount}}},
                 (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result) {
                        console.log(`bet added`);
                        resolve(true);
                    } else {
                        resolve(null);
                    }
                }
            });
        }
    }) 
}

function verifyJwt(jwtString) {
    val = jwt.verify(jwtString, process.env.JWTSECRET);
    return val;
}

module.exports = router;