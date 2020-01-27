var bets = require('express').Router();

bets.get('/createBet', function(req, res, next){
    res.render('create_bet', {title: 'CreateBet'});
});

bets.get('/findBets', function(req, res, next){
    res.render('find_bets', {title : 'FindBets'});
});

module.exports = bets;
