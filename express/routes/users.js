var forgotPasswordUser = require('../models/forgotPasswordUsers');
var UnverifiedUser = require('../models/unverifiedUsers');
var generalFuncs = require('../funcs/generalFuncs');
const utilFuncs = require('../funcs/betFuncs');
var randomstring = require("randomstring");
var User = require("../models/users");
const passport = require("passport");
var express = require('express');
var router = express.Router();


router.post('/getProfilePicture', (req, res) => {
    if (req.body.username) {

        if (utilFuncs.validate(req.body.username, "username")) {

            // need to replace \ for some usernames to retrieve
            // the profile picture correctly 

            req.body.username = req.body.username.replace("\\",'')

            generalFuncs.getProfilePicture(req.body.username).then((response) => {

                if (response) {
                    if (response === "noprofiler") {
                        res.status(200).json({
                            "status": "error",
                            "body": "No profile picture"
                        });

                    } else {
                        res.status(200).json({
                            "status": "success",
                            "body": response
                        });
                    }
                } else {
                    res.status(200).json({
                        "status": "error",
                        "body": "Could not find profile picture"
                    });
                }
            }, () => {
                res.status(400).json({
                    "status": "error",
                    "body": "Invalid username"
                });
            })
        } else {
            res.status(400).json({
                "status": "success",
                "body": "Invalid username"
            });
        }

    } else {
        res.status(400).json({
            "status": "success",
            "body": "No username given"
        });
    }
});

router.post('/isSignedIn', (req, res) => {
    utilFuncs.isSignedIn(req.cookies).then((signedIn) => {
        if (signedIn) {
            res.status(200).json({
                "status":"success",
                "body": signedIn
            })
        } else {
            res.status(400).json({
                "status":"success",
                "body": "Not signed in"
            })
        }
    }, () => {
        res.status(400).json({
            "status":"error",
            "body": "Not signed in"
        })
    })
});

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    User.findOne({"user_name":req.user.user_name}, (err, foundUser) => {
        if (err) {
            res.redirect(`http://localhost:3000/users/login`)
        } else {
            if (foundUser) {
                foundUser.accessToken = utilFuncs.createJwt({user_name:foundUser.user_name});
                foundUser.save();
                res.cookie('Authorization', 'Bearer ' + foundUser.accessToken)
                res.redirect(`http://localhost:3000/users/profile?${foundUser.user_name}`)
            } else {
                res.redirect(`http://localhost:3000/users/login`)
            }
        }
    });
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/users/login' }), (req, res) => {
    User.findOne({"user_name":req.user.user_name}, (err, foundUser) => {
        if (err) {
            res.redirect(`http://localhost:3000/users/login`)
        } else {
            if (foundUser) {
                foundUser.accessToken = utilFuncs.createJwt({user_name:foundUser.user_name});
                foundUser.save();
                res.cookie('Authorization', 'Bearer ' + foundUser.accessToken)
                res.redirect(`http://localhost:3000/users/profile?${foundUser.user_name}`)
            } else {
                res.redirect(`http://localhost:3000/users/login`)
            }
        }
    });
});

router.get('/auth/steam', passport.authenticate('steam'));

router.get('/auth/steam/callback', passport.authenticate('steam', { failureRedirect: '/login' }), (req, res) => {
    User.findOne({"user_name":req.user.user_name}, (err, foundUser) => {
        if (err) {
            res.redirect(`http://localhost:3000/users/login`)
        } else {
            if (foundUser) {
                foundUser.accessToken = utilFuncs.createJwt({user_name:foundUser.user_name});
                foundUser.save();
                res.cookie('Authorization', 'Bearer ' + foundUser.accessToken)
                res.redirect(`http://localhost:3000/users/profile?${foundUser.user_name}`)
            } else {
                res.redirect(`http://localhost:3000/users/login`)
            }
        }
    });
});

router.post('/register', (req, res) => {
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

        if (!utilFuncs.validate(username, "username") && run) {
            res.status(401).json({
                "status": "error",
                "body": "Username must be between 1 and 32 characters long"
            });
            run = false;
        }
        let test2 = conditions.some(el => password.includes(el));

        if (!utilFuncs.validate(password, "password") && test2 && run) {
            res.status(401).json({
                "status": "error",
                "body": "Password must be more than 8 characters in length"
            });
            run = false;
        } else if (utilFuncs.validate(password, "password") && test2 && run) {
            res.status(401).json({
                "status": "error",
                "body": "Invalid characters in password"
            });
            run = false;
        }

        if (run) {
            if (password.length < 8) {
                res.status(401).json({
                    "status": "error",
                    "body": "Password must be 8 characters in length"
                });
                run = false;
            }
        }


        utilFuncs.isPasswordCompromised(password).then((data) => {
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
        }, () => {
            // Error in this case means the password was NOT found
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
                            utilFuncs.checkIfExisting(username, "unverified").then((data) => {
                                if (data) {
                                    /**
                                     * instead we are going to want to send an email with a code to verifiy an email address
                                     *  then call another function to make the account
                                     */
                                    const loginCode = randomstring.generate(6);
                                    /**
                                     * Exec the python script to send the login code to the user
                                     */

                                    utilFuncs.sendEmail(email, `Activate your account ${data}`, loginCode.toString()).then(() => {
                                        /**
                                         * Add entry in unverified user table
                                         */
                                        let newUser = new UnverifiedUser();
                                        newUser.user_name = username;
                                        newUser.email = email;
                                        newUser.password = newUser.generateHash(password);
                                        newUser.activationCode = loginCode;
                                        newUser.profilePicture = req.body.profilePicture
                                        newUser.githubID = null;
                                        newUser.googleID = null;
                                        newUser.steamID = null;

                                        newUser.save((err) => {
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
router.post('/verifyAccount', (req, res) => {
    /**
     * Handles requests of the login code
     */
    if (req.body.activationCode === null || req.body.activationCode === undefined) {
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
                } else {
                    if (foundUser) {
                        /**
                         * If the activation code exists for a user, save that user into the
                         * permanent table
                         */
                        let newUser = new User();

                        newUser.user_name = foundUser.user_name;
                        newUser.email = foundUser.email;
                        newUser.githubID = null;
                        newUser.googleID = null;
                        newUser.steamID = null;
                        newUser.password = foundUser.password;
                        newUser.accessToken = utilFuncs.createJwt({ user_name: foundUser.user_name });
                        newUser.profilePicture = foundUser.profilePicture;
                        newUser.coins = 1000;

                        newUser.save((err, user) => {
                            if (err) {
                                res.status(401).send({
                                    "status": "error",
                                    "body": "Error saving user"
                                });
                            } else {
                                UnverifiedUser.deleteOne({ "activationCode": activationCode }, (err) => {
                                    if (err) {
                                        res.status(400).send({
                                            "status": "error",
                                            "body": "Error deleting unverified user account"
                                        });
                                    } else {
                                        res.cookie('Authorization', 'Bearer ' + user.accessToken);
                                        res.status(200).send({
                                            "status": "success",
                                            "body": "Account verified"
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        res.status(400).send({
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
router.post('/login', function(req, res) {

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
                res.status(400).json({
                    "status": "error",
                    "body": err
                });
            }
            if (user) {
                // compare hashes of passwords
                if (user.validPassword(password)) {
                    // create token to tell it's them
                    user.accessToken = utilFuncs.createJwt({ user_name: username });
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
});

router.post('/forgotPassword', (req, res) => {
    if (req.body.user_name) {
        if (utilFuncs.validate(req.body.user_name, "username")) {
            const username = req.body.user_name;
            utilFuncs.checkIfExisting(username, "forgotten").then((username) => {
                // if resolved promise
                if (username) {
                    User.findOne({ "user_name": username }, (err, foundUser) => {
                        if (err) {
                            res.send(err);
                        }
                        if (foundUser) {
                            utilFuncs.isOAuthUser(foundUser).then((platform) => {
                                if (platform) {
                                    res.status(401).send({
                                        "status": "error",
                                        "body": `You're account is managed through ${platform}, please change your password on their platform`
                                    });
                                } else {
                                    // isn't an OAuth user
                                    let newUser = new forgotPasswordUser();
                                    newUser.user_name = foundUser.user_name;
                                    newUser.email = foundUser.email;
                                    const resetCode = randomstring.generate(10);
                                    newUser.resetCode = resetCode;
                                    // TODO this is a temp localhost fix
                                    const resetUrl = `http://localhost:3000/users/resetPassword?from=${resetCode}`;
                                    newUser.save((err) => {
                                        if (err) {
                                            res.status(400).send({
                                                "status": "error",
                                                "body": "BAD error"
                                            });
                                        }
                                    });
                                    utilFuncs.sendEmail(foundUser.email, `Update your password ${foundUser.user_name}`, resetUrl).then(() => {
                                        res.status(200).send({
                                            "status": "success",
                                            "body": `Password reset email sent`
                                        });
                                    }, () => {
                                        res.status(400).send({
                                            "status": "error",
                                            "body": "Error sending password reset email"
                                        });
                                    });
                                        }
                                    })
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
            }, () => {
                res.status(400).send({
                    "status": "error",
                    "body": "Invalid input"
                });
            });


        }
    } else {
        res.status(401).send({
            "status": "error",
            "body": "Invalid input"
        });
    }
});

router.post('/resetPassword', (req, res) => {
    if (req.body.newPassword && req.body.resetCode) {

        if (utilFuncs.validate(req.body.resetCode, "resetCode")) {

            if (utilFuncs.validate(req.body.newPassword, "password")) {

                utilFuncs.isPasswordCompromised(req.body.newPassword).then((data) => {
                    if (data) {
                        // Credit to https://github.com/EigerEx for this idea
                        const resArray = ["365online.com", "paypal.com", "wish.com", "https://onlinebanking.aib.ie/", "facebook.com", "gmail.com",
                            "twitter.com", "stripe.com", "blackboard.nuigalway.ie", "instagram.com"
                        ];

                        res.status(401).json({
                            "status": "error",
                            "body": `You have used this password previously on ${resArray[Math.floor(Math.random()*resArray.length)]}. This incident has been reported to an administrator`
                        });
                    }
                }, () => {
                    forgotPasswordUser.findOne({ resetCode: req.body.resetCode }, (err, foundUser) => {
                        if (err) {
                            res.send(err);
                        }
                        if (foundUser) {
                            utilFuncs.resetPassword(foundUser.email, req.body.newPassword).then((username) => {
                                forgotPasswordUser.deleteOne({ "user_name": username }, (err) => {
                                    if (err) {
                                        res.status(400).send({
                                            "status": "error",
                                            "body": "Failed to delete old password"
                                        });
                                    } else {
                                        console.log("Deleted from forgotten table");
                                        res.status(200).send({
                                            "status": "success",
                                            "body": "Password has been reset"
                                        });
                                    }
                                });
                            }, () => {
                                res.status(400).send({
                                    "status": "error",
                                    "body": "Failed to delete old password"
                                });
                            });

                        } else {
                            res.status(400).send({
                                "status": "error",
                                "body": "Invalid input"
                            });
                        }
                    });
                })
            } else {
                res.status(400).send({
                    "status": "error",
                    "body": "Invalid input"
                });
            }
        } else {
            res.status(400).send({
                "status": "error",
                "body": "Invalid input"
            });
        }

    } else {
        res.status(400).send({
            "status": "error",
            "body": "Invalid input"
        });
    }
});


module.exports = router;