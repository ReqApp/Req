const utilFuncs = require('../funcs/betFuncs');
var User = require('../models/users');
var express = require('express');
var router = express.Router();
const axios = require("axios");
const multer = require('multer');
const imgur = require('imgur');
const fs = require('fs');

imgur.setClientId(process.env.imgurClientID);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/tempImages/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

function fileFilter(req, file, cb) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

router.post('/uploadImage', upload.single('imageUpload'), (req, res, next) => {
    if (req.file) {
        uploadToImgur(req.file.path).then((response) => {
            if (response) {
                checkImage(response).then((success) => {
                    if (success) {
                        // Image is safe
                        User.findOne({ user_name: req.body.user_name }, (err, foundUser) => {
                            if (err) {
                                res.status(400).json({
                                    "status": "error",
                                    "body": "User does not exist"
                                });
                            } else {
                                if (foundUser) {
                                    User.findOneAndUpdate({ user_name: foundUser.user_name }, { 'profilePicture': response }, (err) => {
                                        if (err) {
                                            res.status(400).json({
                                                "status": "error",
                                                "body": err
                                            });
                                        } else {
                                            res.status(200).json({
                                                "status": "error",
                                                "body": "Profiler for " + foundUser.user_name + " updated to " + response
                                            });
                                        }
                                    });
                                } else {
                                    res.status(400).json({
                                        "status": "error",
                                        "body": "User does not exist"
                                    });
                                }
                            }
                        });
                    } else {
                        // Image is NSFW
                        res.status(401).json({
                            "status": "error",
                            "body": "We do not allow NSFW profilers. Choose another"
                        });
                    }
                }, (err) => {
                    res.status(400).json({
                        "status": "error",
                        "body": "Please choose another image"
                    });
                });
            } else {
                res.status(401).json({
                    "status": "error",
                    "body": "Invalid image"
                });
            }
        }).then(() => {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.log(err);
            }
        });

    } else {
        res.status(401).json({
            "status": "error",
            "body": "Invalid image"
        });
    }
});

function checkImage(imageUrl) {
    return new Promise((resolve, reject) => {
        const endPoint = "https://api.uploadfilter.io/v1/nudity";
        axios({
            method: 'get',
            url: endPoint,
            headers: {
                'apikey': process.env.uploadFilterIOAPIKey,
                'url': imageUrl
            }
        }).then((response) => {
            if (response.data.result.value < 0.2) {
                // if the value is < 0.2 it's classified as safe
                console.log("safe");
                resolve(true);
            } else {
                console.log("nsfw");
                resolve(null);
            }
        }).catch((err) => {
            console.log(`The err@ ${err}`)
            console.log("caught err callback")
            reject(err);
        });
    })
}

function uploadToImgur(filePath) {
    return new Promise((resolve, reject) => {
        imgur.uploadFile(filePath).then((response) => {
            resolve(response.data.link);
        }).catch((err) => {
            reject(null);
        });
    })
}

router.post('/sendEmail', (req, res, next) => {
    // used for sending important error messages from automated scripts like big red button betting
    // in email to the apps email so errors are logged in a simple form. Otherwise they'd be lost in the 
    // console
    if (req.body.secret === process.env.ReqSecret) {
        utilFuncs.sendEmail("reqnuig@gmail.com", req.body.subject, req.body.errorMessage).then(() => {
            res.status(200).json({
                "status": "success",
                "body": "error email sent"
            });
        }, (err) => {
            res.status(400).json({
                "status": "err",
                "body": err
            });
        });
    } else {
        res.status(401).json({
            "status": "error",
            "body": "You are not authorised to do this"
        });
    }
})


module.exports = router;