var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const passport = require("passport");


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/home', (req, res, next) => {
    res.render('home');
})

router.get('/exampleBet', (req, res, next) => {
    res.render('exampleBet');
});

router.get('/createBet', function(req, res, next){
    res.render('create_bet', {title: 'CreateBet'});
});

router.get('/findBets', function(req, res, next){
    res.render('find_bets', {title : 'FindBets'});
});

router.post('/getTime', (req, res, next) => {
    const date = new Date();
    const currDate = date.getTime();
    res.json({ "Current time": currDate });
});

router.get('/auth/google/callback', passport.authenticate('google'), (req, res, next) => {
    res.send("reached callback url");


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
                            "body": response
                        });
                    } else {
                        res.status(404).json({
                            "status":"information",
                            "body": "invalid response"
                        });
                    }
                }, (err) => {
                    console.log(err);
                    res.status(400).json({
                        "status":"error",
                        "body":err
                    });
                });
                break;
                
            default:
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

// all o auth
// new betting idea in concrete
// MORE docs

function verifyJwt(jwtString) {
    let val = jwt.verify(jwtString, 'fgjhidWSGHDSbgnkjsmashthegaffteasandcoffee');
    return val;
}

function makeArticleBet(input) {
    return new Promise((resolve, reject) => {
        if (input.sitename && input.directory && input.month && input.year && input.searchTerm) {    
            const child = require('child_process').execFile;
            const executablePath = "./articleStats/articleGetLinux";
            const parameters = ["-s",input.sitename, input.directory, input.month, input.year, input.searchTerm];
    
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
