const stripe = require("stripe")(process.env.stripePrivateKey);
var utilFuncs = require('../funcs/betFuncs');
var express = require('express');
var User = require('../models/users');
var randomstring = require("randomstring");
const uuid = require("uuid");
var router = express.Router();

router.post('/hello', (req, res, next) => {
    res.status(200).json({ "status": "ok" });
})

router.post("/checkout", async(req, res) => {

    let error;
    let status;
    try {
        const { product, token } = req.body;

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        const idempotencyKey = randomstring.generate(32);
        const charge = await stripe.charges.create({
            amount: product.price * 100,
            currency: "eur",
            customer: customer.id,
            receipt_email: token.email,
            description: `Purchased ${product.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip
                }
            }
        }, {
            idempotencyKey
        });
        console.log(`\n\n\n\n\n`);
        console.log("Charge:", { charge });
        console.log(charge.receipt_email);


        User.findOne({ email: charge.receipt_email }, (err, foundUser) => {
            if (err) {
                res.status(400).json({
                    "status": "error",
                    "body": "Error searching for associated account"
                });
            } else {
                if (foundUser) {
                    utilFuncs.payOut(foundUser.user_name, 1, 1000).then((response) => {
                        if (response) {

                            utilFuncs.sendEmail(charge.receipt_email, 'Thank you for your purchase!', 'Login to find your coins deposited into you account').then((response) => {
                                if (response) {
                                    res.status(200).json({
                                        "status": "success",
                                        "body": "Payment successfully validated, check your email for validation"
                                    });
                                } else {
                                    res.status(400).json({
                                        "status": "error",
                                        "body": "Could not send purchase validation email"
                                    });
                                }
                            }, (err) => {
                                res.status(400).json({
                                    "status": "error",
                                    "body": "Error sending email"
                                });
                            })
                        } else {
                            res.status(400).json({
                                "status": "error",
                                "body": "Could not pay out to user " + foundUser.user_name
                            });
                        }
                    }, (err) => {
                        res.status(400).json({
                            "status": "error",
                            "body": "Error paying out"
                        });
                    })
                } else {
                    res.status(400).json({
                        "status": "error",
                        "body": "No user is associated with the given email address"
                    });
                }
            }
        })

    } catch (error) {
        console.error("Error:", error);
        res.status(200).json({
            "status": "error",
            "body": "err"
        })
    }

});


module.exports = router;