const stripe = require('stripe')(process.env.stripeSecret);
var generalFuncs = require('../funcs/generalFuncs');
const utilFuncs = require('../funcs/betFuncs');
var User = require('../models/users');
var express = require('express');
const axios = require("axios");
var router = express.Router();

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
    if (req.body.username) {
        generalFuncs.getCoins(req.body.username).then((data) => {
            if (data || data == "0") {
                res.status(200).json({
                    "status": "success",
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