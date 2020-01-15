var express = require('express');
var router = express.Router();

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


module.exports = router;
router.get('/createBet', function(req, res, next){
    res.render('create_bet', {title: 'CreateBet'});
});

router.get('/findBets', function(req, res, next){
    res.render('find_bets', {title : 'FindBets'});
});

module.exports = router;
