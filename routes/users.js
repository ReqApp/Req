var express = require('express');
var router = express.Router();
var User = require('../models/users');
var UnverifiedUser = require('../models/unverifiedUsers');
var forgotPasswordUser = require('../models/forgotPasswordUsers');
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

router.get('/verifyAccount', (req, res, next) => {
    res.render('verifyAccount');
});

router.get('/forgotPassword', (req, res, next) => {
    res.render('forgotPassword');
});

function validateInput(input, type) {
    /**
     * Validate the password and usernames kind of
     */
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
    /**
     * Handles post requests from register page
     */
    if (req.body.user_name && req.body.password && req.body.email) {
        let run = true;
        let username = req.body.user_name;
        let password = req.body.password;
        let email = req.body.email;
    
        /**
         * Used to clean email for invalid characters
         */
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
        /**
         * If no input has been invalid, continue
         */
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
                    /**F
                     * instead we are going to want to send an email with a code to verifiy an email address
                     *  then call another function to make the account
                     */
                    const loginCode = randomstring.generate(6);
                    /**
                     * Exec the python script to send the login code to the user
                     */
                    const spawn = require("child_process").spawn;
                    const pythonProcess = spawn('python3',["emailService/sendEmail.py", email , `Activate your account ${username}`, `${loginCode.toString()}`]);
                    pythonProcess.stdout.on('data', (data) => {
                        console.log(data.toString());
                    });
                    /**
                     * Add entry in unverified user table
                     */
                    let newUser = new UnverifiedUser();
                    newUser.user_name = username;
                    newUser.email = email;
                    newUser.password = newUser.generateHash(password);
                    newUser.activationCode = loginCode;
        
                    newUser.save((err, user) => {
                            if (err) {
                                throw err;
                            }
                        });
    
                    res.status(200).json({
                        "status":"information",
                        "body":"success"
                    });
                }
            });
        }
    } else {
        res.status(401).json({
            "status":"error",
            "body":"Invalid POST parameters"
        });
    }
    
});

router.post('/verifyAccount', (req, res, next) => {
    /**
     * Handles requests of the login code
     */
    if (req.body.activationCode) {
        const activationCode = req.body.activationCode;
        const searchQuery = /^[0-9a-zA-Z]+$/;

        if (activationCode.match(searchQuery)) {
           // Activation code is safe
            UnverifiedUser.findOne({"activationCode":activationCode}, (err, foundUser) => {
                if (err) {
                    res.send(err);
                }
                /**
                 * If the activation code exists for a user, save that user into the
                 * permanent table
                 */                
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
                });
            });
        } else {
            console.log("Dodgy input");
        }
    }

});

// handles POST requests to /login
router.post('/login', function(req, res, next) {
    if (req.body.user_name && req.body.password) {
        const username = req.body.user_name;
        const password = req.body.password;
    
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
    }
});
/**
 * change this to email to stop spam abuse
 */

router.post('/forgotPassword', (req, res, next) => {
    if (req.body.user_name) {
        if (validateInput(req.body.user_name, "usename")) {
            const username = req.body.user_name;

            User.findOne({"user_name":username}, (err, foundUser) => {
                if (err) {
                    res.send(err);
                }

                let newUser = new forgotPasswordUser();
                newUser.user_name = foundUser.user_name;
                newUser.email = foundUser.email;
                const resetUrlString = randomstring.generate(10);
                // TODO this is a temp localhost fix
                newUser.resetCode = resetUrlString;
                newUser.resetUrl = `http://localhost:8673/users/forgotPassword?from=${resetUrlString}`;
                newUser.save((err, user) => {
                    if (err) {
                        throw err;
                    }
                });

                const spawn = require("child_process").spawn;
                const pythonProcess = spawn('python3',["emailService/sendEmail.py", foundUser.email , `Update your password ${foundUser.user_name}`, `${newUser.resetUrl}`]);
                pythonProcess.stdout.on('data', (data) => {
                    console.log(data.toString());
                    res.json({
                        "status":"information",
                        "body":`${newUser.resetCode}`
                    });
                });
            });
        }
    }
});

router.post('/resetPassword', (req, res, next) => {
    if (req.body.newPassword) {
        if (validateInput(req.body.newPassword, "password")) {
            forgotPasswordUser.findOne({resetUrl:req.body.fromUrl}, (err, foundUser) => {
                if (err) {
                    res.send(err);
                }
                console.log(foundUser);
                var deleteUser = foundUser;
            });

            User.update({user_name:deleteUser.user_name}, {
                password: deleteUser.generateHash(req.body.newPassword)
            });

            res.status(200).json({
                "status":"information",
                "body":"success"
            })
        }

    }
    res.status(400).json({
        "status":"error",
        "body":"Not found"
    });
});

function createJwt(profile) {
    return jwt.sign(profile, 'fgjhidWSGHDSbgnkjsmashthegaffteasandcoffee', {
        expiresIn: "3d"
    });
};

module.exports = router;