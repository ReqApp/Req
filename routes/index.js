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

module.exports = router;