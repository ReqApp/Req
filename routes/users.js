var express = require('express');
var router = express.Router();
var User = require('../models/users');
var UnverifiedUser = require('../models/unverifiedUsers');
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
    let run = true;
    let username = req.body.user_name;
    let password = req.body.password;
    let email = req.body.email;

    const conditions = ["\"", "<", ">","'","`"];

    let test1 = conditions.some(el => email.includes(el));
    if (test1) {
        res.status(401).json({
            "status":"error",
            "body":"Invalid characters in email address"
        });
        run = false;
    }

    /*
     **  Check if username and password fits the bill before
     **  sending it onto mongo
     */
    if (!(username === encodeURIComponent(username))) {
        res.status(401).json({
            "status": "error",
            "body": "Username cannot contain those characters"
        });
        run = false;
    }

    if (!validateInput(username, "username")) {
        res.status(401).json({
            "status": "error",
            "body": "Username must be between 1 and 32 characters long"
        });
        run = false;
    }

    if (!validateInput(password, "password")) {
        res.status(401).json({
            "status": "error",
            "body": "Password must be more than 8 characters in length"
        });
        run = false;
    }
    if (run) {
        User.findOne({ "user_name": username }, (err, foundUser) => {
            if (err) {
                res.send(err);
            }
    
            if (foundUser) {
                res.status(401).json({
                    "status": "information",
                    "body": "Username or email address already in use"
                });
            } else {
                // successful, make the user an account
    
                // instead we are going to want to send an email with a code to verifiy an email address
                // then call another function to make the account
                const loginCode = randomstring.generate(6);
                const spawn = require("child_process").spawn;
                const pythonProcess = spawn('python3',["emailService/sendEmail.py", email , `Activate your account ${username}`, `${loginCode.toString()}s`]);
                pythonProcess.stdout.on('data', (data) => {
                    console.log(data.toString());
                });

                let newUser = new UnverifiedUser();
                newUser.user_name = username;
                newUser.email = email;
                newUser.password = newUser.generateHash(password);
                newUser.activationCode = loginCode;
    
                newUser.save((err, user) => {
                        if (err) {
                            throw err;
                        }
                       console.log("New user saved");
                       console.log(user);
                    });

                res.status(200).json({
                    "status":"y",
                    "body":"success"
                });

                // let newUser = new User();
    
                // newUser.user_name = username;
                // newUser.password = newUser.generateHash(password);
                // newUser.accessToken = createJwt({ user_name: username });
    
                // newUser.save((err, user) => {
                //     if (err) {
                //         throw err;
                //     }
                //     res.cookie('Authorization', 'Bearer ' + user.accessToken);
                //     res.json({ "success": "account created :)" });
                // });
            }
        });
    }
});

router.post('/verifyAccount', (req, res, next) => {
    if (req.body.activationCode) {
        const activationCode = req.body.activationCode;
        const searchQuery = /^[0-9a-zA-Z]+$/;

        if (activationCode.match(searchQuery)) {
           // Activation code is safe
            UnverifiedUser.findOne({"activationCode":activationCode}, (err, foundUser) => {
                if (err) {
                    res.send(err);
                }
                console.log("The first find:" +foundUser);
                
                let newUser = new User();
    
                newUser.user_name = foundUser.user_name;
                newUser.email = foundUser.email;
                newUser.password = foundUser.password;
                newUser.accessToken = createJwt({ user_name: foundUser.user_name });

                newUser.save((err, user) => {
                    if (err) {
                        throw err;
                    }
                    res.cookie('Authorization', 'Bearer ' + user.accessToken);
                    res.json({ "success": "account created :)" });
                    console.log("Made this:" +user);
                });
            });
        } else {
            console.log("Dodgy input");
        }
    }

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

router.get('/verifyAccount', (req, res, next) => {
    res.render('verifyAccount');
});

function createJwt(profile) {
    return jwt.sign(profile, 'fgjhidWSGHDSbgnkjsmashthegaffteasandcoffee', {
        expiresIn: "3d"
    });
};

module.exports = router;