var bets = require('express').Router();

bets.get('/createBet', function(req, res, next){
    res.render('create_bet', {title: 'CreateBet'});
});

module.exports = bets;
