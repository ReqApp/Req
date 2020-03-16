var BetRegion = require('../models/bettingRegions');
var testBetsFinished = require('../models/testBetsFinished');
var generalFuncs = require("../funcs/generalFuncs");
var articleBet = require('../models/articleBets');
const utilFuncs = require('../funcs/betFuncs');
var testBets = require('../models/testBets');
var router = require('express').Router();
var Bet = require('../models/betData');
var User = require('../models/users');
var mongoose = require('mongoose');

/**
 * <-------------------------------------------------------------------->
 *                      Page Rendering APIs
 * <-----------------------------------------------------y--------------->
 */

// Render create bet page
router.get('/createBet', (req, res, next) => {
    res.render('create_bet', { title: 'CreateBet' });
});

// Render find bet page
router.get('/findBets', (req, res, next) => {
    res.render('find_bets', { title: 'FindBets' });
});

// Render debug and testing page
router.get('/debugTest', (req, res, next) => {
    res.render('debugAndTestingPage');
});

/**
 * <-------------------------------------------------------------------->
 *                              Bet APIs
 * <-------------------------------------------------------------------->
 */

// API to handle adding bet to database
router.post('/addBetToDataBase', function(req, res, next) {
    var bet = new Bet(req.body);
    bet.save(function(err, savedBet) {
        if (err) {
            console.log(err);
        } else {
            res.json(savedBet);
        }
    });
});

// API for getting bets in region
router.get('/getBetsInRegion', (req, res) => {
    let id = req.query.id;
    if (id != null) {
        Bet.find({ bet_region_id: id.toString() }, (err, bets) => {
            if (err) {
                res.status(500).json({
                    "status": "error",
                    "body": "error"
                });
            } else {
                res.status(200).json(bets);
            }
        });
    }
});

/**
 * <-------------------------------------------------------------------->
 *                          Bet Region APIs
 * <-------------------------------------------------------------------->
 */

// API for adding new betting region
router.post('/addBettingRegion', function(req, res, next) {
    var region = new BetRegion(req.body);
    region.save(function(err, savedRegion) {
        if (err) {
            console.log(err);
        } else {
            res.json(savedRegion);
        }
    });
});

// API for getting available betting regions
router.get('/getBettingRegions', (req, res) => {
    // Verify query parameters
    let latitude = req.query.lat;
    let longitude = req.query.lng;

    if (latitude == null || longitude == null) {
        res.status(400).json({
            "status": "error",
            "body": "Invalid query parameters"
        });
    } else if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({
            "status": "error",
            "body": "Invalid coords"
        })
    } else {
        // Perform calculations server-side to increase perfromance
        BetRegion.find({}).exec((err, betRegions) => {
            if (err) {
                res.status(500).json({
                    "status": "error",
                    "body": err
                });
            } else {
                let regionsToSend = [];
                const LEN = betRegions.length;
                for (var i = 0; i < LEN; i++) {
                    var betRegion = betRegions.pop();
                    var d = utilFuncs.calcDistance({ lat: betRegion.latitude, lng: betRegion.longitude }, { lat: req.query.lat, lng: req.query.lng });
                    // Convert kilometers to metres
                    if ((d * 1000) <= betRegion.radius) {
                        regionsToSend.push(betRegion);
                        /*
                        console.log("Calculated Distance: " + (d * 1000).toString());
                        console.log("Bet Radius: " + betRegion.radius.toString() + "\n");
                        */
                    } else {
                        /*
                        console.log("Calculated Distance: " + (d * 1000).toString());
                        console.log("Bet Radius: " + betRegion.radius.toString() + "\n");
                        */
                    }
                }
                console.log(regionsToSend);
                res.json(regionsToSend);
            }
        });
    }
});

// Allows user to add bet to betting region
router.put('/addBetToRegion', function(req, res, next) {
    // Takes bet region id
    console.log(req.body);
    var regionID = mongoose.Types.ObjectId(req.body.regionID.toString());
    var betID = mongoose.Types.ObjectId(req.body.betID.toString());
    // Find corresponding region and include bet id in bets array and increment num bets
    BetRegion.findOneAndUpdate({ '_id': regionID }, { '$push': { 'bet_ids': betID }, '$inc': { 'num_bets': 1 } }, { useFindAndModify: false }).exec(function(err, betRegion) {
        if (err) {
            console.log(err);
        } else {
            res.json(betRegion);
        }
    });
});

// Gets specific region by id
router.get('/getRegionByID', function(req, res, next) {
    console.log(req.query.id);
    var id = mongoose.Types.ObjectId(req.query.id.toString());
    console.log(id);
    BetRegion.findById(id, function(err, betRegion) {
        if (err) {
            console.log(err);
        } else {
            res.json(betRegion);
        }
    });
});

/**
 * <-------------------------------------------------------------------->
 *                      Testing and Debug APIs
 * <-------------------------------------------------------------------->
 */

// API for adding multiple bets to database
router.post('/addMultBets', function(req, res, next) {
    //console.log(req.body);
    Bet.insertMany(req.body.betData, function(err, bets) {
        if (err) {
            console.log(err);
        } else {
            res.json(bets);
        }
    });

});

// API for adding multiple bet regions to database
router.post('/addMultRegions', function(req, res, next) {
    console.log(req.body);
    BetRegion.insertMany(req.body.regions, function(err, regions) {
        if (err) {
            console.log(err);
        } else {
            res.json(regions);
        }
    });
});

// API updates bet regions with multiple bets
router.put('/addMultBetsToRegion', function(req, res, next) {
    // Takes bet region id
    console.log(req.body);
    var regionID = mongoose.Types.ObjectId(req.body.regionID.toString());

    var bets = req.body.bets;
    var ids = [];
    for (var i = 0; i < bets.length; i++) {
        ids.push(mongoose.Types.ObjectId(bets[i].toString()));
    }
    var numBets = bets.length;
    console.log(ids);
    // Find corresponding region and include bet id in bets array and increment num bets
    BetRegion.findOneAndUpdate({ '_id': regionID }, { '$push': { 'bet_ids': { '$each': ids } }, '$inc': { 'num_bets': numBets } }, { useFindAndModify: false }).exec(function(err, betRegion) {
        if (err) {
            console.log(err);
        } else {
            res.json(betRegion);
        }
    });
});

router.post('/makeBet', (req, res, next) => {

    const firstPlaceCut = parseFloat(req.body.firstPlaceCut);
    const secondPlaceCut = parseFloat(req.body.secondPlaceCut);
    const thirdPlaceCut = parseFloat(req.body.thirdPlaceCut);

    // if it's a multi type bet it must allocate the betting percentages
    if (req.body.type === "multi" && (isNaN(firstPlaceCut) || isNaN(secondPlaceCut) || isNaN(thirdPlaceCut))) {
        res.status(400).json({
            "status": "error",
            "body": "Invalid bet percentages entered"
        })
    } else {

        if ((req.body.type && req.body.type && req.body.title && req.body.deadline && req.body.username) ||
            (req.body.type && req.body.title && req.body.deadline && req.body.deadline &&
                req.body.firstPlaceCut && req.body.secondPlaceCut && req.body.thirdPlaceCut)) {
            // bet has input parameters for either a binary or multi bet

            let inputObj = {
                "type": req.body.type,
                "side": req.body.side,
                "title": req.body.title,
                "deadline": req.body.deadline,
                "username": req.body.username,
                "firstPlaceCut": firstPlaceCut,
                "secondPlaceCut": secondPlaceCut,
                "thirdPlaceCut": thirdPlaceCut
            }

            if (req.body.type === "multi" && (firstPlaceCut + secondPlaceCut + thirdPlaceCut) != 1) {
                // The percentage payouts must add up to 100%
                res.status(400).json({
                    "status": "error",
                    "body": "Payout percentages don't add up to 100%"
                })

            } else {
                utilFuncs.createBet(inputObj).then((response) => {
                    if (response) {
                        res.status(200).json({
                            "status": "success",
                            "body": "Bet made!"
                        });
                    } else {
                        res.status(400).json({
                            "status": "error",
                            "body": `No response, bet was not made`
                        });
                    }
                }, (err) => {
                    res.status(400).json({
                        "status": "err",
                        "body": `Error: Bet was not made. ${err}`
                    });
                })
            }
        } else {
            res.status(400).json({
                "status": "error",
                "body": "Invalid input"
            });
        }
    }
});

router.post('/decideBet', (req, res, next) => {

    let inputObj = {
        "betID": req.body.betID,
        "result": req.body.result,
        "accessToken": req.cookies.Authorization
    }

    if (utilFuncs.validate(req.body.betID, "id") &&
        utilFuncs.validate(req.body.result, "result")) {

        utilFuncs.isValidBetID(inputObj.betID).then((validBetID) => {
            if (validBetID) {
                utilFuncs.decideBet(inputObj).then((success) => {
                    if (success) {
                        console.log(`Bet #${inputObj.betID} finished`);
                        res.status(200).json({
                            "status": "success",
                            "body": "Bet finished successfully"
                        });
                    } else {
                        console.log(`Bet #${inputObj.betID} unsuccessful`);
                        res.status(400).json({
                            "status": "error",
                            "body": "Error paying out winnings"
                        });
                    }
                }, (err) => {
                    res.status(400).json({
                        "status": "error",
                        "body": err
                    });
                });
            } else {
                res.status(400).json({
                    "status": "error",
                    "body": "Invalid betID"
                });
            }
        }, (err) => {
            res.status(400).json({
                "status": "error",
                "body": "Error checking betID"
            });
        });
    } else {
        res.status(400).json({
            "status": "error",
            "body": "Invalid input"
        });
    }
});

router.post('/betOn', (req, res, next) => {
    let inputObj = {
        "betID": req.body.betID,
        "username": req.body.username,
        "betAmount": req.body.betAmount,
        "type": req.body.type,
        "side": req.body.side,
        "bet": req.body.bet
    }

    utilFuncs.isValidBetID(inputObj.betID).then((resp) => {
        if (resp) {
            utilFuncs.hasEnoughCoins(req.body.username, req.body.betAmount).then((data) => {
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
                                        "status": "success",
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
});

router.post('/bigButtonBet', (req, res, next) => {
    // A secret is defined in the env which is sent to validate
    // that it is the Req account finalising or starting a big red button bet

    if (req.body.secret) {
        if (req.body.secret === process.env.ReqSecret) {
            if (req.body.action === "end") {
                generalFuncs.getBigButtonCurrentID().then((betID) => {
                    let inputObj = {
                        "betID": betID,
                        "result": req.body.result,
                        "action": req.body.action
                    }

                    if (utilFuncs.validate(inputObj.result, "result")) {
                        utilFuncs.isValidBetID(inputObj.betID).then((validBetID) => {
                            if (validBetID) {
                                utilFuncs.decideBet(inputObj).then((success) => {
                                    if (success) {
                                        generalFuncs.resetBigButtonPress().then(() => {
                                            console.log(`Bet #${inputObj.betID} finished`);
                                            res.status(200).json({
                                                "status": "success",
                                                "body": "Bet finished successfully"
                                            });
                                        }, (err) => {
                                            res.status(400).json({
                                                "status": "error",
                                                "body": err
                                            });
                                        })
                                    } else {
                                        res.status(400).json({
                                            "status": "error",
                                            "body": "Error paying out winnings"
                                        });
                                    }
                                }, (err) => {
                                    res.status(400).json({
                                        "status": "error",
                                        "body": err
                                    });
                                })
                            } else {
                                console.log("invalid bet id")
                                res.status(400).json({
                                    "status": "error",
                                    "body": "Invalid bet ID"
                                }, (err) => {
                                    res.status(400).json({
                                        "status": "error",
                                        "body": "Error validating betID"
                                    });
                                });
                            }
                        })
                    } else {
                        res.status(400).json({
                            "status": "error",
                            "body": "Invalid input"
                        });
                    }

                }, (err) => {
                    res.status(400).json({
                        "status": "error",
                        "body": "Error reading betID"
                    });
                })

            } else if (req.body.action === "start") {
                const today = new Date();
                let tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1)

                let inputObj = {
                    "type": "multi",
                    "side": null,
                    "title": "How many times will the big red button be pressed today?",
                    "deadline": tomorrow.getTime(),
                    "username": "Req",
                    "firstPlaceCut": 0.85,
                    "secondPlaceCut": 0.1,
                    "thirdPlaceCut": 0.05
                }

                utilFuncs.createBet(inputObj).then((response) => {
                    if (response) {
                        generalFuncs.writeBigButtonCurrentID(response._id).then((success) => {
                            if (success) {
                                res.status(200).json({
                                    "status": "success",
                                    "body": "Big red button bet Bet made!",
                                    "betID": response._id
                                });
                            } else {
                                res.status(400).json({
                                    "status": "err",
                                    "body": `Error writing betID to file`
                                });
                            }
                        }, (err) => {
                            res.status(400).json({
                                "status": "err",
                                "body": `Error reading from bigButtonID file`
                            });
                        })
                    } else {
                        res.status(400).json({
                            "status": "error",
                            "body": `No response, big red button bet was not made`
                        });
                    }
                }, (err) => {
                    res.status(400).json({
                        "status": "err",
                        "body": `Error: big red button bet was not made. ${err}`
                    });
                })

            }
        } else {
            res.status(400).json({
                "status": "error",
                "body": "You are not authorised to do this"
            });
        }
    } else {
        res.status(400).json({
            "status": "error",
            "body": "Invalid input"
        });
    }

});

router.post('/pressBigButton', (req, res, next) => {
    generalFuncs.handleBigButtonPress().then((response) => {
        if (response) {
            console.log(response);
            res.status(200).json({
                "status": "success",
                "body": "Big red button pressed"
            });
        } else {
            res.status(400).json({
                "status": "error",
                "body": "Error pressing big red button"
            });
        }

    }, (err) => {
        res.status(400).json({
            "status": "error",
            "body": "Error pressing big red button"
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

router.post('/betExpired', (req, res, next) => {
    // if a bet has expired then the creator will be punished
    // and winnings will be paid back
    if (req.body.secret === process.env.ReqSecret) {

        let inputObj = {
            "betID": req.body.betID,
            "secret": process.env.ReqSecret,
            "expired": true
        }
        utilFuncs.decideBet(inputObj).then((response) => {
            if (response) {
                res.status(200).json({
                    "status": "success",
                    "body": "Penalised creator and paid back to bettors"
                });
            } else {
                res.status(400).json({
                    "status": "error",
                    "body": "Oops, couldn't pay back to the bettors"
                });
            }
        }, (err) => {
            res.status(400).json({
                "status": "error",
                "body": err
            });
        })


    } else {
        res.status(401).json({
            "status": "error",
            "body": "You are not authorized to do this"
        });
    }
});

router.post('/getAllBetsDev', (req, res, next) => {
    if (req.body.secret === process.env.ReqSecret) {
        utilFuncs.getBets().then((allBets) => {
            if (allBets) {
                res.send(allBets);
            } else {
                res.status(401).json({
                    "status": "error",
                    "body": "No bets found"
                });
            }
        }, (err) => {
            res.status(401).json({
                "status": "error",
                "body": "Error retrieving bets"
            });
        });
    } else {
        res.status(401).json({
            "status": "error",
            "body": "You are not authorized to do this"
        });
    }
});

module.exports = router;