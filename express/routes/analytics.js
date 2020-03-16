var analyticFuncs = require("../funcs/analyticsFuncs");
var utilFuncs = require('../funcs/betFuncs');
var router = require('express').Router();

router.post('/getBettingHistory', (req, res) => {
    if (utilFuncs.validate(req.body.username, "username")) {
        analyticFuncs.getBettingHistory(req.body.username).then((response) => {
            if (response) {
                res.status(200).json({
                    "status": "success",
                    "body": response
                });
            } else {
                res.status(400).json({
                    "status": "error",
                    "body": "No bets found"
                });
            }
        }, (err) => {
            res.status(400).json({
                "status": "error",
                "body": err
            });
        })
    } else {
        res.status(400).json({
            "status": "error",
            "body": "Invalid username"
        });
    }
});

module.exports = router;