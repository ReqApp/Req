var express = require('express');
var router = express.Router();
var User = require('../models/users');

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
