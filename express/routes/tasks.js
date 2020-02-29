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
                        res.status(200).json({
                            "status": response
                        });
                    } else {
                        // Image is NSFW
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

// router.post('/checkImage', (req, res, next) => {
//     const endPoint = "https://api.uploadfilter.io/v1/nudity";

//     axios({
//         method: 'get',
//         url: endPoint,
//         headers: {
//             'apikey': process.env.uploadFilterIOAPIKey,
//             'url': req.body.Url
//         }
//     }).then((response) => {
//         res.status(200).send({
//             "status": response.data.result.value
//         });
//     }).catch((err) => {
//         console.log(err);
//         res.status(400).json({
//             "status": "error",
//             "body": err
//         });
//     });
// });

function uploadToImgur(filePath) {
    return new Promise((resolve, reject) => {
        imgur.uploadFile(filePath).then((response) => {
            resolve(response.data.link);
        }).catch((err) => {
            reject(null);
        });
    })
}


module.exports = router;