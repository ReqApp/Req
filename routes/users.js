var express = require('express');
var router = express.Router();
var User = require('../models/users');
//var UnverifiedUser = require('../models/unverifiedUsers');
var jwt = require('jsonwebtoken');
var randomstring = require("randomstring");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

// serves register.hbs page which is also login
router.get('/register', (req, res, next) => {
    res.render('register');
});

function validateInput(input, type) {
    if (type === 'password') {
        if (input.length > 8) {
            return true;
        } else {
            return false;
        }
    } else {
        if (input.length < 32 && input.length > 0) {
            return true;
        } else {
            return false;
        }
    }
}

router.post('/register', (req, res, next) => {
    let username = req.body.user_name;
    let password = req.body.password;
    let email = req.body.email;

    /*
     **  Check if username and password fits the bill before
     **  sending it onto mongo
     */
    if (!(username === encodeURIComponent(username))) {
        res.json({
            "status": "error",
            "body": "Username cannot contain those characters"
        });
        return;
    }

    if (!validateInput(username, "username")) {
        res.json({
            "status": "error",
            "body": "Username must be between 1 and 32 characters long"
        });
        return;
    }

    if (!validateInput(password, "password")) {
        res.json({
            "status": "error",
            "body": "Password must be more than 8 characters in length"
        });
        return;
    }

    User.findOne({ "user_name": username }, (err, foundUser) => {
        if (err) {
            res.send(err);
        }

        if (foundUser) {
            res.status(401).json({
                "status": "information",
                "body": "Username already in use"
            });
        } else {
            // successful, make the user an account

            // instead we are going to want to send an email with a code to verifiy an email address
            // then call another function to make the account
            const loginCode = randomstring.generate(8);
            const spawn = require("child_process").spawn;
            const pythonProcess = spawn('python3',["emailService/sendEmail.py", email , `Activate your account ${username}`, `${loginCode.toString()}s`]);
            pythonProcess.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            let newUser = new User();

            newUser.user_name = username;
            newUser.password = newUser.generateHash(password);
            newUser.accessToken = createJwt({ user_name: username });

            newUser.save((err, user) => {
                if (err) {
                    throw err;
                }
                res.cookie('Authorization', 'Bearer ' + user.accessToken);
                res.json({ "success": "account created :)" });
            });
        }
    });

});

// handles POST requests to /login
router.post('/login', function(req, res, next) {
    var username = req.body.user_name;
    var password = req.body.password;

    // if a user matching login credentials exists
    User.findOne({ "user_name": username }, function(err, user) {
        if (err) {
            throw err;
        }

        if (user) {
            // compare hashes of passwords
            if (user.validPassword(password)) {
                // create token to tell it's them
                user.accessToken = createJwt({ user_name: username });
                user.save();
                // save the JWT to schema entry
                res.cookie('Authorization', 'Bearer ' + user.accessToken);
                res.json({ "success": "logged in" });
            } else {
                // if hashes don't match
                res.status(401).send({
                    "status": "error",
                    "body": "Email or password invalid"
                });
            }
            // if no user found
        } else {
            res.status(401).send({
                "status": "error",
                "body": "Username not found"
            });
        }
    });

});

function createJwt(profile) {
    return jwt.sign(profile, 'fgjhidWSGHDSbgnkjsmashthegaffteasandcoffee', {
        expiresIn: "3d"
    });
};

module.exports = router;