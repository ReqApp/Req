var express = require('express');
var router = express.Router();
var Bet = require('../models/betData');
var calcDistance = require('./calcDistance');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/home', (req, res, next) => {
    res.render('home');
})

router.post('getTime', (req, res, next) => {
    const date = new Date();
    const currDate = date.getTime();
    res.json({ "Current time": currDate });
});

// serves register.hbs page which is also login
router.get('/register', (req, res, next) => {
    res.render('register');
});

router.get('/exampleBet', (req, res, next) => {
    res.render('exampleBet');
})

router.get('/createBet', function(req, res, next){
    res.render('create_bet', {title: 'CreateBet'});
});

router.get('/findBets', function(req, res, next){
    res.render('find_bets', {title : 'FindBets'});
});

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
    })
});

// API for getting bets from database
router.get('/getBets', function(req, res, next){
    // Perform calculations server-side to increase perfromance
    Bet.find({}).exec(function(err, bets){
        if(err){
            throw(err);
        }else{
            for(var i = 0; i < bets.length; i++){
                var d = calcDistance({lat : bets[i].latitude, lng : bets[i].longitude}, {lat : req.query.latitude, lng : req.query.longitude});
                console.log(d);
                // Convert kilometers to metres
                if((d * 1000) > bets[i].radius){
                    bets.splice(i, 1);
                }
            }
            res.json(bets);
        }
    });
})

module.exports = router;
