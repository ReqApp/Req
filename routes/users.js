var forgotPasswordUser = require('../models/forgotPasswordUsers');
var UnverifiedUser = require('../models/unverifiedUsers');
const keccak512 = require('js-sha3').keccak512;
var randomstring = require("randomstring");
var User = require('../models/users');
const passport = require("passport");
var jwt = require('jsonwebtoken');
var express = require('express');
const axios = require("axios");
var router = express.Router();
var util = require('util');

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

router.get('/testing', (req, res, next) => {
    res.json({ status: "success", message: "Welcome To Testing API" });
});

router.get('/profile', (req, res, next) => {
    if (req.cookies.Authorization) {
        const jwtString = req.cookies.Authorization.split(' ');
        const profile = verifyJwt(jwtString[1]);
        if (profile) {
            res.send('Hello ' + profile.user_name);
        }
    } else {
        res.render('register');
    }
});

router.get('/forgotPassword', (req, res, next) => {
    res.render('forgotPassword');
});


router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/auth/google/callback', passport.authenticate('google'), (req, res, next) => {
    res.cookie('Authorization', 'Bearer ' + req.user.accessToken);
    res.render('index', { title: req.user_name });
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/users/register' }), (req, res) => {
    res.cookie('Authorization', 'Bearer ' + req.user.accessToken);
    res.render('index', { title: req.user_name });
});


router.get('/auth/steam', passport.authenticate('steam'));

router.get('/auth/steam/callback', passport.authenticate('steam', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect home.
    res.cookie('Authorization', 'Bearer ' + req.user.accessToken);
    res.render('index', { title: req.user_name });
});

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
        const conditions = ["\"", "<", ">", "'", "`"];

        let test1 = conditions.some(el => email.includes(el));
        if (test1) {
            res.status(401).json({
                "status": "error",
                "body": "Invalid characters in email address"
            });
            run = false;
        }

        /*
         **  Check if username and password fits the bill before
         **  sending it onto mongo
         */
        if (!(username === encodeURIComponent(username)) && run) {
            res.status(401).json({
                "status": "error",
                "body": "Username cannot contain those characters"
            });
            run = false;
        }

        if (!validateInput(username, "username") && run) {
            res.status(401).json({
                "status": "error",
                "body": "Username must be between 1 and 32 characters long"
            });
            run = false;
        }
        let test2 = conditions.some(el => password.includes(el));

        if (!validateInput(password, "password") && test2 && run) {
            res.status(401).json({
                "status": "error",
                "body": "Password must be more than 8 characters in length"
            });
            run = false;
        } else if (validateInput(password, "password") && test2 && run) {
            res.status(401).json({
                "status": "error",
                "body": "Invalid characters in password"
            });
            run = false;
        }


        isPasswordCompromised(password).then((data) => {
            if (data) {

                // Credit to https://github.com/EigerEx for this idea
                const resArray = ["365online.com", "paypal.com", "wish.com", "https://onlinebanking.aib.ie/", "facebook.com", "gmail.com",
                    "twitter.com", "stripe.com", "blackboard.nuigalway.ie", "instagram.com"
                ];

                res.status(401).json({
                    "status": "error",
                    "body": `This password has been previously used on ${resArray[Math.floor(Math.random()*resArray.length)]}. This incident has been reported to an administrator`
                });
            }
        }, (err) => {
            if (run) {
                User.findOne({ "user_name": username }, (err, foundUser) => {
                    if (err) {
                        res.send(err);
                    } else {
                        if (foundUser) {
                            res.status(401).json({
                                "status": "information",
                                "body": "Username or email address already in use"
                            });
                        } else {

                            checkIfExisting(username, "unverified").then((data) => {
                                if (data) {
                                    /**
                                     * instead we are going to want to send an email with a code to verifiy an email address
                                     *  then call another function to make the account
                                     */
                                    const loginCode = randomstring.generate(6);
                                    /**
                                     * Exec the python script to send the login code to the user
                                     */

                                    sendEmail(email, `Activate your account ${data}`, loginCode.toString()).then(() => {
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

                                        // res.render('verifyAccount');
                                        // res.redirect('verifyAccount');
                                        res.status(200).send({ "status": "success" });
                                    }, (err) => {
                                        console.log(err);
                                    });
                                } else {
                                    res.status(400).send({
                                        "status": "error",
                                        "body": "Check your email for reset link"
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    } else {
        res.status(401).json({
            "status": "error",
            "body": "Invalid POST parameters"
        });
    }

});

router.post('/verifyAccount', (req, res, next) => {
    /**
     * Handles requests of the login code
     */
    if (req.body.activationCode === undefined) {
        res.status(401).send({
            "status": "error",
            "body": "Invalid input"
        });
    } else {
        const activationCode = req.body.activationCode;
        const searchQuery = /^[0-9a-zA-Z]+$/;

        if (activationCode.match(searchQuery)) {

            // Activation code is safe
            UnverifiedUser.findOne({ "activationCode": activationCode }, (err, foundUser) => {
                if (err) {
                    res.send(err);
                    console.log("err in unverified user lookup");
                } else {
                    if (foundUser) {
                        console.log(`Found in uverified lookup ${foundUser}`);
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
                            console.log("saved: " + user);
                            res.cookie('Authorization', 'Bearer ' + user.accessToken);
                            res.json({ "success": "account created :)" });
                        });

                        UnverifiedUser.deleteOne({ "activationCode": activationCode }, (err) => {
                            if (err) {
                                res.send(err);
                            } else {
                                console.log("deleted someone");
                            }
                        });
                    } else {
                        res.status(401).send({
                            "status": "error",
                            "body": "Invalid input"
                        });
                    }
                }
            });
        } else {
            res.status(401).send({
                "status": "error",
                "body": "Invalid input"
            });
        }
    }
});

// handles POST requests to /login
router.post('/login', function(req, res, next) {

    const username = req.body.user_name;
    const password = req.body.password;

    if (username === undefined || password === undefined) {
        res.status(400).json({
            "status": "error",
            "body": "Invalid parameters"
        });
    } else {
        // if a user matching login credentials exists
        User.findOne({ "user_name": username }, function(err, user) {
            if (err) {
                console.log("err thrown")
                res.status(400).json({
                    "status": "error",
                    "body": err
                });
            }

            if (user) {
                // compare hashes of passwords
                if (user.validPassword(password)) {
                    // create token to tell it's them
                    user.accessToken = createJwt({ user_name: username });
                    user.save();
                    // save the JWT to schema entry
                    res.cookie('Authorization', 'Bearer ' + user.accessToken);
                    res.status(200).json({
                        "status": "success",
                        "body": "Logged in successfully"
                    });
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

    // } else {
    //     console.error.log("invalid params there");
    //     res.status(401).send({
    //         "status": "error",
    //         "body": "Invalid parameters"
    //     });
    // }
});

router.post('/forgotPassword', (req, res, next) => {
    if (req.body.user_name) {
        if (validateInput(req.body.user_name, "username")) {
            const username = req.body.user_name;

            checkIfExisting(username, "forgotten").then((username) => {
                // if resolved promise
                if (username) {
                    User.findOne({ "user_name": username }, (err, foundUser) => {
                        if (err) {
                            res.send(err);
                        }
                        if (foundUser) {
                            let newUser = new forgotPasswordUser();

                            newUser.user_name = foundUser.user_name;
                            newUser.email = foundUser.email;
                            const resetUrlString = randomstring.generate(10);
                            newUser.resetCode = resetUrlString;
                            // TODO this is a temp localhost fix
                            newUser.resetUrl = `http://localhost:8673/users/forgotPassword?from=${resetUrlString}`;
                            newUser.save((err, user) => {
                                if (err) {
                                    throw err;
                                }
                            });
                            sendEmail(foundUser.email, `Update your password ${foundUser.user_name}`, newUser.resetUrl).then(() => {
                                res.status(200).send({
                                    "status": "information",
                                    "body": `Password reset email sent`
                                });
                            }, (err) => {
                                console.log(err);
                            });
                        } else {
                            res.status(400).send({
                                "status": "error",
                                "body": "Check your email for reset link"
                            });
                        }

                    });

                } else {
                    res.status(400).send({
                        "status": "error",
                        "body": "Check your email for reset link"
                    });
                }
            }, (err) => {
                // if rejected promise
                console.log(`BAD RESULT: ${err}`);
            });


        }
    } else {
        res.status(401).send({
            "status": "error",
            "body": "Invalid input"
        });
    }
});

router.post('/resetPassword', (req, res, next) => {
    if (req.body.newPassword && req.body.fromUrl) {

        if (validateInput(req.body.fromUrl, "url")) {

            if (validateInput(req.body.newPassword, "password")) {

                isPasswordCompromised(req.body.newPassword).then((data) => {
                    if (data) {
                        // Credit to https://github.com/EigerEx for this idea
                        const resArray = ["365online.com", "paypal.com", "wish.com", "https://onlinebanking.aib.ie/", "facebook.com", "gmail.com",
                            "twitter.com", "stripe.com", "blackboard.nuigalway.ie", "instagram.com"
                        ];

                        res.status(401).json({
                            "status": "error",
                            "body": `This password has been previously used on ${resArray[Math.floor(Math.random()*resArray.length)]}. This incident has been reported to an administrator`
                        });
                    }
                }, (err) => {
                    forgotPasswordUser.findOne({ resetUrl: req.body.fromUrl }, (err, foundUser) => {
                        if (err) {
                            res.send(err);
                        }
                        if (foundUser) {

                            resetPassword(foundUser.email, req.body.newPassword).then((username) => {
                                forgotPasswordUser.deleteOne({ "user_name": username }, (err) => {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        console.log("Deleted from forgotten table");
                                        res.status(200).send({
                                            "status": "information",
                                            "body": "success"
                                        });
                                    }
                                });
                            }, (err) => {
                                console.log(err);
                            });

                        } else {
                            res.status(401).send({
                                "status": "error",
                                "body": "Invalid input"
                            });
                        }
                    });
                })


            } else {
                res.status(401).send({
                    "status": "error",
                    "body": "Invalid input"
                });
            }
        } else {
            res.status(401).send({
                "status": "error",
                "body": "Invalid input"
            });
        }

    } else {
        res.status(401).send({
            "status": "error",
            "body": "Invalid input"
        });
    }
});

function createJwt(profile) {
    return jwt.sign(profile, process.env.JWTSECRET, {
        expiresIn: "3d"
    });
};

function checkIfExisting(username, type) {
    if (type === "forgotten") {
        // if there is a forgotten email entry already existing (a link)
        return new Promise(function(resolve, reject) {
            forgotPasswordUser.findOne({ "user_name": username }, (err, foundUser) => {
                if (err) {
                    reject(Error(err))
                } else {
                    if (foundUser) {
                        console.log(`found`);
                        resolve(null);
                    } else {
                        console.log(`not found`);
                        resolve(username);
                    }
                }
            });
        });
    } else if (type === "unverified") {
        // if there is a forgotten email entry already existing (a link)
        return new Promise(function(resolve, reject) {
            UnverifiedUser.findOne({ "user_name": username }, (err, foundUser) => {
                if (err) {
                    reject(Error(err))
                } else {
                    if (foundUser) {
                        resolve(null);
                    } else {
                        resolve(username);
                    }
                }
            });
        });
    }
}

function resetPassword(email, newPassword) {
    return new Promise((resolve, reject) => {
        User.findOne({ email: email }, (err, theUser) => {
            if (err) {
                res.send(err);
            }
            if (theUser) {
                theUser.password = theUser.generateHash(newPassword);
                theUser.save((err) => {
                    if (err) {
                        res.send(err);
                        reject(Error(err));
                    } else {
                        console.log("password changed");
                        resolve(theUser.user_name);
                    }
                });
            }
        });
    });
}

function sendEmail(email, subject, body) {
    return new Promise((resolve, reject) => {
        const spawn = require("child_process").spawn;
        const pythonProcess = spawn('python', ["emailService/sendEmail.py", email, subject, body]);
        pythonProcess.stdout.on('data', (data) => {
            console.log(data.toString());
            resolve()
        });
        pythonProcess.stderr.on('data', (data) => {
            reject(Error(data));
        });
    });
}

function validateInput(input, type) {
    const conditions = ["\"", "<", ">", "'", "`"];
    /**
     * Validate the password and usernames kind of
     */
    if (type == 'password') {
        if (input.length > 8) {
            let test2 = conditions.some(el => input.includes(el));
            if (test2) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    } else if (type == "username") {
        if (input.length < 32 && input.length > 0) {
            return true;
        } else {
            return false;
        }
    } else if (type == 'url') {
        let test2 = conditions.some(el => input.includes(el));
        if (test2) {
            return false;
        } else {
            return true;
        }
    }
}

function isPasswordCompromised(input) {
    return new Promise((resolve, reject) => {
        const hashed = keccak512(input);
        axios.get(`https://passwords.xposedornot.com/api/v1/pass/anon/${hashed.slice(0,10)}`).then((data) => {
            if (data.Error) {
                // Error in this case means that the password was NOT found
                resolve(null);
            } else {
                resolve(true);
            }
        }).catch(((err) => {
            reject(null);
        }));
    });
}

function verifyJwt(jwtString) {
    let val = jwt.verify(jwtString, process.env.JWTSECRET);
    return val;
}

module.exports = router;