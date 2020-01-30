var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
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

router.get('/exampleBet', (req, res, next) => {
    res.render('exampleBet');
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
        if (profile) {
            res.render('home');
        } else {
            res.render('forgotPassword');
        }
    } else {
        res.render('home');
    }

});

router.post('/createArticleBet', (req, res, next) => {
    if (req.body.betType) {
        switch (req.body.betType) {
            case 'article':
                makeArticleBet(req.body).then((response) => {
                    if (response) {
                        res.status(200).json({
                            "status": "information",
                            "body": response
                        });
                    }
                }, (err) => {
                    res.status(400).json({
                        "status": "error",
                        "body": err
                    });
                });
                break;

            default:
                res.status(401).json({
                    "status": "information",
                    "body": "Invalid param"
                });
                break;
        }
    } else {
        res.status(400).json({
            "status": "error",
            "body": "invalid request"
        });
    }

});

function verifyJwt(jwtString) {
    let val = jwt.verify(jwtString, process.env.JWTSECRET);
    return val;
}

function makeArticleBet(input) {
    return new Promise((resolve, reject) => {
        if (input.sitename && input.directory && input.month && input.year && input.searchTerm) {
            
            if (validateInput(input.sitename, "article") && validateInput(input.sitename, "article") &&
                validateInput(input.month, "article") && validateInput(input.year, "article") && 
                validateInput(input.searchTerm,"article")) {
                    const child = require('child_process').execFile;
                    const executablePath = "./articleStats/articleGetLinux";
                    const parameters = ["-s", input.sitename, input.directory, input.month, input.year, input.searchTerm];
        
                    child(executablePath, parameters, function(err, data) {
                        if (err) {
                            console.log(err);
                            reject(null);
                        } else {
                            // log to DB and then send back ok signal
                            newBet = new articleBet();
                            newBet.title = `[${input.sitename}] - ${input.searchTerm}`;
                            newBet.subtext = `${input.directory} - ${input.month}/${input.year}`;
        
                            const date = new Date();
                            const currDate = date.getTime();
                            newBet.timePosted = currDate;
        
                            newBet.save((err, user) => {
                                if (err) {
                                    throw err;
                                } else {
                                    resolve(data.toString());
                                }
                            });
                        }
                    });
                } else {
                    res.status(401).send({
                        "status":"error",
                        "body":"Invalid characters in input"
                    });
                    reject(null);
                }
                } else {
                    res.status(401).send({
                        "status":"error",
                        "body":"Invalid input"
                    });
                    reject(null);
                }
        });
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

router.get('/createBet', function(req, res, next) {
    res.render('create_bet', { title: 'CreateBet' });
});

router.get('/findBets', function(req, res, next) {
    res.render('find_bets', { title: 'FindBets' });
});

module.exports = router;