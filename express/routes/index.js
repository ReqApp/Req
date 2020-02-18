var articleBet = require('../models/articleBets');
const utilFuncs = require('../funcs/betFuncs');
var express = require('express');
var router = express.Router();
var User = require('../models/users');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/home', (req, res, next) => {
    if (req.cookies.Authorization) {
        const jwtString = req.cookies.Authorization.split(' ');
        const profile = utilFuncs.verifyJwt(jwtString[1]);
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

router.get('/reactTest', function(req, res, next) {
    res.send("Message from backend");
})

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
        let profile = utilFuncs.verifyJwt(jwtString[1]);
        if (profile) {
            res.render('home');
        } else {
            res.render('forgotPassword');
        }
    } else {
        res.render('home');
    }
});

router.post('/getCoins', (req, res, next) => {
    utilFunc.isSignedIn(req.cookies).then((data) => {
        if (data) {
            getCoins(data.user_name).then((data) => {
                if (data || data == "0") {
                    res.status(200).json({
                        "status": "information",
                        "body": data
                    });
                } else {
                    res.status(400).json({
                        "status": "error",
                        "body": "Error getting coins"
                    });
                }
            }).catch((err) => {
                res.status(400).json({
                    "status": "error",
                    "body": err
                });
            })
        } else {
            res.status(400).json({
                "status": "error",
                "body": "Invalid jwt"
            });
        }
    })
});


router.post('/createArticleBet', (req, res, next) => {
    
        utilFuncs.makeArticleBet(req.body, req.body.user_name).then((response) => {
            if (response) {
                console.log(`Response: ${response}`);
                res.status(200).json({
                    "status": "information",
                    "body": response
                });
            } else {
                res.status(400).json({
                    "status": "error",
                    "body": "Invalid input"
                });
            }
        }, (err) => {
            res.status(400).json({
                "status": "error",
                "body": err
            });
        });
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

module.exports = router;