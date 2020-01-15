var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/home', (req, res, next) => {
    res.render('home');
})

router.post('/getTime', (req, res, next) => {
    const date = new Date();
    const currDate = date.getTime();
    res.json({ "Current time": currDate });
});

router.get('/exampleBet', (req, res, next) => {
    res.render('exampleBet');
})

router.get('/members', (req, res, next) => {
    if (req.cookies.Authorization) {
        let jwtString = req.cookies.Authorization.split(' ');
        let profile = verifyJwt(jwtString[1]);
            if (profile) {
                res.render('members');
            } else {
                res.render('notAllowed');
            }
    } else {
        res.render('notAllowed');
    }
    
});

function verifyJwt(jwtString) {
    let val = jwt.verify(jwtString, 'fgjhidWSGHDSbgnkjsmashthegaffteasandcoffee');
    return val;
}


module.exports = router;