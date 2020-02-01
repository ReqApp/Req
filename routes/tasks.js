var express = require('express');
var router = express.Router();
const axios = require("axios")
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
                console.log(response);
                res.status(200).json({
                    "status": response
                });
            } else {
                res.status(401).json({
                    "status": "error",
                    "body": "invalid image"
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
            "body": "invalid image"
        });
    }
});

router.post('/checkImage', (req, res, next) => {
    const endPoint = "https://api.uploadfilter.io/v1/nudity";

    axios({
        method: 'get',
        url: endPoint,
        headers: {
            'apikey': process.env.uploadFilterIOAPIKey,
            'url': req.body.Url
        }
    }).then((response) => {
        res.status(200).send({
            "status": response.data.result.value
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).json({
            "status": "error",
            "body": err
        });
    });
});

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