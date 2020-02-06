var express = require('express');
var router = express.Router();
var User = require('../models/users');
var jwt = require('jsonwebtoken');
var Bet = require('../models/betData');
var calcDistance = require('./calcDistance');
const passport = require("passport");
var articleBet = require('../models/articleBets');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


router.get('/home', (req, res, next) => {
    if (req.cookies.Authorization) {
        const jwtString = req.cookies.Authorization.split(' ');
        const profile = verifyJwt(jwtString[1]);
        if (profile) {
            res.send('Hello ' + profile.user_name);
        }
    }
})

/*GET users, return usernames */
router.get('/getUsers', (req, res, next) => {
    User.find({}, { user_name: 1 }, function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    });
});

/*GET user by ID, retrieves id & username */
router.get('/getUser/:id', (req, res, next) => {
    var id = req.params.id;
    User.find({ _id: id }, { user_name: 1 }, (function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    }));
});

router.get('/profile', function(req, res, next) {
    res.render('profile', { welcome: 'profile page test' });
});

router.get('/createBet', function(req, res, next) {
    res.render('create_bet', { title: 'CreateBet' });
});

router.get('/findBets', function(req, res, next) {
    res.render('find_bets', { title: 'FindBets' });
});

router.get('/getTime', (req, res, next) => {
    const date = new Date();
    const currDate = date.getTime();
    res.json({ "currentTime": currDate });
});

router.get('/articleBetFeed', (req, res, next) => {
    res.render('articleBets');
});

router.get('/members', (req, res, next) => {
    if (req.cookies.Authorization) {
        let jwtString = req.cookies.Authorization.split(' ');
        let profile = verifyJwt(jwtString[1]);
        console.log(`Profile: ${JSON.stringify(profile)}`);
        if (profile) {
            res.render('home');
        } else {
            res.render('forgotPassword');
        }
    } else {``
        console.log(`Didn't verifiy jwt`);
        res.render('home');
    }
});

router.post('/getCoins', (req ,res, next) => {
    if (req.body.jwt) {
        isSignedIn(req.body.jwt).then((data) => {
            if (data) {
                getCoins(data.user_name).then((data) => {
                    if (data || data == "0") {
                        res.status(200).json({
                            "status":"information",
                            "body": data
                        });

                    } else {
                        res.status(400).json({
                            "status":"error",
                            "body":"Error getting coins"
                        });
                    }
                }).catch((err) => {
                    res.status(400).json({
                        "status":"error",
                        "body": err
                    });
                })        
            } else {
                res.status(400).json({
                    "status":"error",
                    "body":"Invalid jwt"
                });
            }
        })
    } else {
        res.status(400).json({
            "status":"error",
            "body": "Invalid input"
        });
    }
});

router.get('/createBet', function(req, res, next) {
    res.render('create_bet', { title: 'CreateBet' });
});

router.get('/findBets', function(req, res, next) {
    res.render('find_bets', { title: 'FindBets' });
});

router.get('/getArticleBets', (req, res, next) => {
    articleBet.find({}).sort({ timePosted: -1 }).exec((err, data) => {
        if (err) {
            throw err;
        } else {
            res.json(data);
        }
    })
});

router.post('/createArticleBet', (req, res, next) => {
    if (req.cookies.Authorization) {
        let jwt = req.cookies.Authorization.split(' ')[1];
        isSignedIn(jwt).then((data) => {
            if (data) {
                const currUsername = data.user_name
                hasEnoughCoins(data.user_name, req.body.betAmount).then((data) => {
                    if (data) {
                        makeArticleBet(req.body, currUsername).then((response) => {
                            if (response) {
                                console.log(`Response: ${response}`);
                                res.status(200).json({
                                    "status": "information",
                                    "body": response
                                });
                            }
                        }, (err) => {
                            console.log("err from make article promise call")
                            res.status(400).json({
                                "status": "error",
                                "body": err
                            });
                        });
                    } else {
                        res.status(400).json({
                            "status":"error",
                            "body":"Insufficient funds"
                        });
                    }
                })
            } else {
                // not signed in, dont let them make a bet
                res.status(400).json({
                    "stauts":"error",
                    "body":"Not signed in"
                });
            }
        })

    }
});

router.post('/updateBet', (req, res, next) => {
    console.log("in update bet");
    if (req.body.betID && req.body.betAmount) {
        console.log(req.body);
        let user = "burnItUp"
        userObj = { 
            username: user,
            betID: req.body.betID,
            betAmount: req.body.betAmount
        }
        hasEnoughCoins(user, req.body.betAmount).then((data) => {
            if (data) {
                console.log("has enough coins");
                addToBet(userObj).then((response) => {
                    if (response) {
                        console.log(response);
                    }   else {
                        console.log("no bet found");
                    }
                });
            } else {
                res.status(400).json({
                    "status":"error",
                    "body":"Insufficient funds"
                });
            }
        });
    } else {
        console.log(`Req body ${req.body}`);
        res.status(400).json({
            "status":"error",
            "body":"Invalid params"
        });
    }
});

function makeArticleBet(input, username) {
    return new Promise((resolve, reject) => {
        if (input.sitename && input.directory && input.month && input.year && input.searchTerm && input.ends && input.betAmount && username) {

            if (validateInput(input.sitename, "article") && validateInput(input.directory, "article") &&
                validateInput(input.month, "article") && validateInput(input.year, "article") &&
                validateInput(input.searchTerm, "article")) {

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
                        console.log(`Trying to save with ${username}`);
                        newBet = new articleBet({
                            title: `How many times will the ${input.sitename} have '${input.searchTerm}' in article titles`,
                            subtext: `${input.directory} - ${input.month}/${input.year}`,
                            result: data,
                            for: 0,
                            against: 0,
                            ends: parsedTime,
                            forUsers: {user_name:username, betAmount: input.betAmount}
                        });
                     
                        newBet.save((err, user) => {
                            if (err) {
                                console.log("error saving user")
                                reject(err);
                            } else {
                                console.log(user);
                                resolve(user);
                            }
                        });
                    }
                });
            } else {
                console.log(`Input: ${input}`);
                console.log("invalid chars in an input");
                reject(null);
            }
        } else {
            console.log("invalid input numbers");
            console.log(input, username);
            reject(null);
        }
    });
}

function hasEnoughCoins(username, transactionAmount) {
    return new Promise((resolve, reject) => {
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
                        console.log(`${foundUser.coins} - ${transactionAmount}`);
                        resolve(null);
                    }
                }
            }
        });
    });
}

function getCoins(username) {
    return new Promise((resolve, reject) => {
        User.findOne({user_name: username}, (err, foundUser) => {
            if (err) {
                reject(err);
            } else {
                if (foundUser) {
                    resolve(foundUser.coins);
                } else {
                    resolve(null);
                }
            }
        });
    })
}

function validateInput(input, type) {
    const conditions = ["\"", "<", ">", "'", "`"];
    let test = conditions.some(el => input.includes(el));

    if (type == "article") {
        if (test) {
            return false;
        } else {
            return true;
        }
    }
}

// API to handle adding bet to database
router.post('/createBet/addBetToDataBase', function(req, res, next) {
    var bet = new Bet(req.body);
    bet.save(function(err, savedBet) {
        if (err) {
            console.log(err);
        } else {
            res.json(savedBet);
        }
    })
});

// API for getting bets from database
router.get('/getBets', function(req, res, next) {
    // Perform calculations server-side to increase perfromance
    Bet.find({}).exec(function(err, bets) {
        if (err) {
            throw (err);
        } else {
            for (var i = 0; i < bets.length; i++) {
                var d = calcDistance({ lat: bets[i].latitude, lng: bets[i].longitude }, { lat: req.query.latitude, lng: req.query.longitude });
                console.log(d);
                // Convert kilometers to metres
                if ((d * 1000) > bets[i].radius) {
                    bets.splice(i, 1);
                }
            }
            res.json(bets);
        }
    });
});

function addToBet(userObj) {
    return new Promise((resolve, reject) => {
        articleBet.findOneAndUpdate({_id:userObj.betID},
            {$push: {againstUsers: {user_name:userObj.username, betAmount: userObj.betAmount}}},
             (err, result) => {
            if (err) {
                console.log("error in find");
                reject(err);
            } else {
                if (result) {
                    console.log(`Push result: ${result}`);
                } else {
                    console.log("failure pushing");
                    resolve(null);
                }
            }
        });
    }) 
}

function isSignedIn(jwt) {
    return new Promise((resolve, reject) => {
        if (jwt) {
            const profile = verifyJwt(jwt);
            if (profile) {
                resolve(profile);
            } else {
                resolve(null);
            }
        } else {
            reject(null);
        }
    })
}

function verifyJwt(jwtString) {
    let val = jwt.verify(jwtString, process.env.JWTSECRET);
    return val;
}

module.exports = router;