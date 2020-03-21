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
                res.status(200).json({
                    "status": "success",
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

router.post('/getCreatedBettingHistory', (req, res) => {
    if (utilFuncs.validate(req.body.username, "username")) {
        analyticFuncs.getCreatedBettingHistory(req.body.username).then((response) => {
            if (response) {
                res.status(200).json({
                    "status": "success",
                    "body": response
                });
            } else {
                res.status(200).json({
                    "status": "success",
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

router.post('/getWinLoss', (req, res) => {
    if (utilFuncs.validate(req.body.username, "username")) {
        analyticFuncs.getWinLoss(req.body.username).then((response) => {
            res.status(200).json({
                "status": "success",
                "body": response
            });
        }, (err) => {
            res.status(400).json({
                "status": "error",
                "body": "Error getting win loss ratio"
            });
        })
    } else {
        res.status(400).json({
            "status": "error",
            "body": "Invalid username"
        });
    }
});

router.post('/getPeopleReached', (req, res) => {
    if (utilFuncs.validate(req.body.username, "username")) {
        analyticFuncs.getPeopleReached(req.body.username).then((response) => {
            if (response) {
                res.status(200).json({
                    "status": "success",
                    "body": response
                });
            } else {
                res.status(200).json({
                    "status": "error",
                    "body": "Error getting bets from DB"
                });
            }
        }, (err) => {
            res.status(400).json({
                "status": "error",
                "body": "Error getting people reached"
            });
        })
    } else {
        res.status(400).json({
            "status": "error",
            "body": "Invalid username"
        });
    }
});

router.post('/getBreakdownOfBetTypes', (req, res) => {
    if (utilFuncs.validate(req.body.username, "username")) {
        analyticFuncs.getBreakdownofBetTypes(req.body.username).then((response) => {
            if (response) {
                res.status(200).json({
                    "status": "success",
                    "body": response
                });
            } else {
                res.status(200).json({
                    "status": "success",
                    "body": "No bets found"
                });
            }
        }, (err) => {
            res.status(400).json({
                "status": "error",
                "body": "Error getting bet history breakdown"
            });
        });
    } else {
        res.status(400).json({
            "status": "error",
            "body": "Invalid username"
        });
    }
});

module.exports = router;