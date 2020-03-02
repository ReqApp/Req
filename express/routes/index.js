var articleBet = require('../models/articleBets');
const utilFuncs = require('../funcs/betFuncs');
var express = require('express');
var router = express.Router();
const axios = require("axios");
var User = require('../models/users');
var generalFuncs = require('../funcs/generalFuncs');
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

router.get('/QRTest', (req, res, next) => {
    res.render('exampleBet');
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

router.post('/shortenLink', (req, res, next) => {
    if (req.body.url) {
        axios({
            method: 'POST',
            url: "https://goolnk.com/api/v1/shorten",
            data: {
                "url": req.body.url
            }
        }).then((response) => {
            res.status(200).send({
                "status": "success",
                "body": response.data.result_url
            });
        }, (err) => {
            res.status(400).send({
                "status": "error",
                "body": "Couldn't shorten link"
            });
        })
    } else {
        res.status(400).send({
            "status": "error",
            "body": "No url given"
        });
    }
})

router.post('/getCoins', (req, res, next) => {
    // change in future to take in a jwt and get coins from that,
    // dont want people to be able to view other people's coin amounts
    if (req.body.user_name) {
        generalFuncs.getCoins(req.body.user_name).then((data) => {
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
            "body": "No username given"
        });
    }
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