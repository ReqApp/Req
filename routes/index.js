var express = require('express');
var router = express.Router();
var User = require('../models/users');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/home', (req, res, next) => {
    res.render('home');
})

/*GET users, return usernames */
router.get('/getUsers', (req, res, next) => {
    User.find({},{user_name:1}, function (err, users) {
        if (err)
            res.send(err);

         res.json(users);
    });
});

/*GET user by ID, retrieves id & username */
router.get('/getUser/:id', (req, res, next) => {
    var id = req.params.id;
    User.find({_id:id},{user_name:1}, (function (err, users) {
        if(err)
            res.send(err);

        res.json(users);
    }));
});

router.get('/profile', function(req, res, next) {
    res.render('profile',{ welcome: 'profile page test' });
});

router.post('/getTime', (req, res, next) => {
    const date = new Date();
    const currDate = date.getTime();
    res.json({ "Current time": currDate });
});

router.get('/exampleBet', (req, res, next) => {
    res.render('exampleBet');
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
                            "status":"information",
                            "body":response
                        });
                    } else {

                    }
                }, (err) => {
                    console.log(err);
                    res.status(400).json({
                        "status":"error",
                        "body":"invalid request"
                    });
                });
                break;
                
            default:
                console.log('default bet request');
                res.status(200).json({
                    "status":"information",
                    "body":"request to bet sent!"
                });
                break;
        }
    } else {
        res.status(400).json({
            "status":"error",
            "body":"invalid request"
        });
    }
}); 

function verifyJwt(jwtString) {
    let val = jwt.verify(jwtString, 'fgjhidWSGHDSbgnkjsmashthegaffteasandcoffee');
    return val;
}

function makeArticleBet(input) {
    return new Promise((resolve, reject) => {
        if (input.sitename && input.directory && input.month && input.year && input.searchTerm) {    
            var child = require('child_process').execFile;
            var executablePath = "./articleStats/articleGet";
            var parameters = ["-s",input.sitename, input.directory, input.month, input.year, input.searchTerm];
    
            child(executablePath, parameters, function(err, data) {
                if (err) {
                    console.log(err);
                    reject(null);
                } else {
                    resolve(data.toString());
                }
            });
    
        } else {
           reject(null);
        }
    });
}
module.exports = router;
