const utilFuncs = require('../funcs/betFuncs');
var testBets = require('../models/testBets');
var User = require('../models/users');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var util = require('util');


router.post('/makeBet', (req, res, next) => {
    let inputObj = {
        "title": req.body.title,
        "side": req.body.side,
        "amount": req.body.amount,
        "deadline": req.body.deadline,
        "username": req.body.username
    }
    utilFuncs.hasEnoughCoins(req.body.username, req.body.amount).then((data) => {
        if (data) {
            utilFuncs.createBet(inputObj).then((response) => {
                if (response) {
                    res.status(200).json({
                        "status": "success",
                        "body": "Bet made!"
                    });
                } else {
                    res.status(400).json({
                        "status": "error",
                        "body": "Bet not made no res"
                    });
                }
            }, (err) => {
                console.log(err);
                res.status(400).json({
                    "status": "err",
                    "body": "ERR Bet not made"
                });
            })
        } else {
            console.log(`${inputObj.username} doesn't have enough coins`);
            res.status(400).json({
                "status": "error",
                "body": "Not enough coins"
            });
        }
    }, (err) => {
        console.log(err);
        res.status(400).json({
            "status": "error",
            "body": "Error retrieving coin amount"
        });
    });

});

router.post('/betOn', (req, res, next) => {
    let inputObj = {
        "betID": req.body.betID,
        "username": req.body.username,
        "amount": req.body.amount,
        "side": req.body.side
    }

    utilFuncs.isValidBetID(inputObj.betID).then((resp) => {
        if (resp) {
            utilFuncs.hasEnoughCoins(req.body.username, req.body.amount).then((data) => {
                if (data) {
                    // add in func here to check if they already bet on it
                    utilFuncs.alreadyBetOn(inputObj).then((alreadyBetOn) => {
                        if (alreadyBetOn) {
                            // user has already bet on this post, update their val
                            res.status(400).json({
                                "status": "error",
                                "body": "You have already made a bet on this."
                            });
                        } else {
                            // User has not already made a bet for this post
                            utilFuncs.betOn(inputObj).then((response) => {
                                if (response) {
                                    res.status(200).json({
                                        "status": "error",
                                        "body": "Bet successfully added"
                                    });
                                } else {
                                    res.status(400).json({
                                        "status": "error",
                                        "body": "Bet could not be added"
                                    });
                                }
                            }, (err) => {
                                res.status(400).json({
                                    "status": "error",
                                    "body": "Error adding bet to DB"
                                });
                            });
                        }
                    });
                } else {
                    res.status(400).json({
                        "status": "error",
                        "body": "Insufficient funds"
                    });
                }
            }, (err) => {
                res.status(400).json({
                    "status": "error",
                    "body": "Error retrieving coin amount"
                });
            })
        } else {
            res.status(400).json({
                "status": "error",
                "body": "Invalid betID"
            });
        }
    }, (err) => {
        res.status(400).json({
            "status": "error",
            "body": "Error validating bet ID"
        });
    })
})

// needs server side processing to anonymise the betting users before being sent back to the user
// otherwise the user can see who has bet what amount of any kind
router.post('/getTestBets', (req, res, next) => {

    utilFuncs.getBets().then((data) => {
        if (data) {
            utilFuncs.anonymiseBetData(data).then((response) => {
                if (response) {
                    res.status(200).json(response);
                } else {
                    res.status(400).json({
                        "status": "error",
                        "body": "Error anonymising data nothing"
                    });
                }
            }, (err) => {
                res.status(400).json({
                    "status": "error",
                    "body": "no bets to pull from: " + err
                });
            })
        } else {
            res.status(400).json({
                "status": "error",
                "body": "Could not get bets"
            });
        }
    }, (err) => {
        res.status(400).json({
            "status": "error",
            "body": "Error getting bets from DB"
        });
    })
});

module.exports = router;