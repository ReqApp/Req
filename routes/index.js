var express = require('express');
var router = express.Router();
var User = require('../models/users');
var jwt = require('jsonwebtoken');

// Bet stuff
var Bet = require('../models/betData');
var BetRegion = require('../models/bettingRegions');
var calcDistance = require('./calcDistance');
var mongoose = require('mongoose');

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
    
router.get('/createBet', function(req, res, next){
    res.render('create_bet', {title: 'CreateBet'});
});

router.get('/findBets', function(req, res, next){
    res.render('find_bets', {title : 'FindBets'});
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

// API to handle adding bet to database
router.post('/createBet/addBetToDataBase', function(req, res, next){
    var bet = new Bet(req.body);
    bet.save(function(err, savedBet){
        if(err){
            console.log(err);
        }
        else{
            res.json(savedBet);
        }
    });
});

// API for getting bets from database
router.get('/getBets', function(req, res, next){
    // Perform calculations server-side to increase perfromance
    Bet.find({}).exec(function(err, bets){
        if(err){
            throw(err);
        }else{
            var sendBets = [];
            const LEN = bets.length;
            for(var i = 0; i < LEN; i++){
                var bet = bets.pop();
                var d = calcDistance({lat : bet.latitude, lng : bet.longitude}, {lat : req.query.latitude, lng : req.query.longitude});
                // Convert kilometers to metres
                if((d * 1000) <= bet.radius){
                    sendBets.push(bet);
                    /*
                    console.log("Included")
                    console.log("Bet Name: " + bet.title);
                    console.log("Calculated Distance: " + (d * 1000).toString());
                    console.log("Bet Radius: " + bet.radius.toString() + "\n");
                    */  
                }else{
                    /*
                    console.log("Not Included");
                    console.log("Bet Name: " + bet.title);
                    console.log("Calculated Distance: " + (d * 1000).toString());
                    console.log("Bet Radius: " + bet.radius.toString() + "\n");
                    */
                }
            }
            res.json(sendBets);
        }
    });
});

// Testing API for adding multiple bets to database
router.post('/addMultBets', function(req, res, next){
    console.log(req.body);
    Bet.insertMany(req.body.betData, function(err, bets){
        if(err){
            console.log(err);
        }
        else{
            res.json({success : true});
        }
    });

})

router.get('/debugTest', function(req, res, next){
    res.render('debugAndTestingPage');
});

// API for adding new betting region
router.post('/addBettingRegion', function(req, res, next){
    var region = new BetRegion(req.body);
    region.save(function(err, savedRegion){
        if(err){
            console.log(err);
        }
        else{
            res.json(savedRegion);
        }
    });
});

// API for getting available betting regions
router.get('/getBettingRegions', function(req, res, next){
    // Perform calculations server-side to increase perfromance
    BetRegion.find({}).exec(function(err, betRegions){
        if(err){
            throw(err);
        }else{
            console.log(betRegions);
            var regionsToSend = [];
            const LEN = betRegions.length;
            for(var i = 0; i < LEN; i++){
                var betRegion = betRegions.pop();
                var d = calcDistance({lat : betRegion.latitude, lng : betRegion.longitude}, {lat : req.query.latitude, lng : req.query.longitude});
                // Convert kilometers to metres
                if((d * 1000) <= betRegion.radius){
                    regionsToSend.push(betRegion);
                    /*
                    console.log("Calculated Distance: " + (d * 1000).toString());
                    console.log("Bet Radius: " + betRegion.radius.toString() + "\n");
                    */
                }else{
                    /*
                    console.log("Calculated Distance: " + (d * 1000).toString());
                    console.log("Bet Radius: " + betRegion.radius.toString() + "\n");
                    */
                }
            }
            //console.log(regionsToSend);
            res.json(regionsToSend);
        }
    });
});

// Allows user to add bet to betting region
router.put('/addBetToRegion', function(req, res, next){
    // Takes bet region id
    console.log(req.body);
    var regionID = mongoose.Types.ObjectId(req.body.regionID.toString());
    var betID = mongoose.Types.ObjectId(req.body.betID.toString());
    // Find corresponding region and include bet id in bets array and increment num bets
    BetRegion.findOneAndUpdate({'_id' : regionID}, { '$push' : {'bet_ids' : betID}, '$inc' : { 'num_bets' : 1}}, {useFindAndModify: false}).exec(function(err, betRegion){
        if(err){
            console.log(err);
        }
        else{
            res.json(betRegion);
        }
    });
});

module.exports = router;
