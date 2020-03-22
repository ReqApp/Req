const stripe = require('stripe')(process.env.stripeSecret);
var generalFuncs = require('../funcs/generalFuncs');
const utilFuncs = require('../funcs/betFuncs');
var User = require('../models/users');
var express = require('express');
const axios = require("axios");
var router = express.Router();


router.get('/home', (req, res) => {
    if (req.cookies.Authorization) {
        const jwtString = req.cookies.Authorization.split(' ');
        const profile = utilFuncs.verifyJwt(jwtString[1]);
        if (profile) {
            res.send('Hello ' + profile.user_name);
        }
    }
})

/*GET users, return usernames */
router.get('/getUsers', (req, res) => {
    User.find({}, { user_name: 1 }, function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    });
});

/*GET user by ID, retrieves id & username */
router.get('/getUser/:id', (req, res) => {
    var id = req.params.id;
    User.find({ _id: id }, { user_name: 1 }, (function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    }));
});

router.get('/reactTest', function(req, res) {
    res.send("Message from backend");
})

router.get('/profile', function(req, res) {
    res.render('profile', { welcome: 'profile page test' });
});

router.get('/getTime', (req, res) => {
    const date = new Date();
    const currDate = date.getTime();
    res.json({ "currentTime": currDate });
});

router.post('/shortenLink', (req, res) => {
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
        }, () => {
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

router.post('/getCoins', (req, res) => {
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

module.exports = router;