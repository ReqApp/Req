const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/users');
var jwt = require('jsonwebtoken');
const axios = require('axios')

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: "242136715571-79vhd6vdnm800tpbklnj0d3r8bb2ebkc.apps.googleusercontent.com",
    clientSecret: "TAn1svEkvKqXr5U94VItOL0h",
    callbackURL: "/users/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    // console.log(profile);

    User.findOne({ googleID: profile.id }).then((currentUser) => {
        if (currentUser) {
            // already have this user
            console.log('user is: ', currentUser);
            done(null, currentUser);
        } else {
            // if not, create user in our db
            new User({
                googleID: profile.id,
                user_name: profile.displayName,
                accessToken: createJwt({ user_name: profile.displayName })
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                done(null, newUser);
            });
        }
    });
}));

function checkIfExisting(searchID) {
    return new Promise((resolve, reject) => {
        User.findOne({ googleID: searchID }, (err, foundUser) => {
            if (err) {
                reject(err);
                res.send(err);
            } else {
                if (foundUser) {
                    console.log("user already existing");
                    resolve(foundUser);
                } else {
                    console.log("user not existing yet");
                    resolve(foundUser);
                }
            }
        });
    });
}

function createJwt(profile) {
    return jwt.sign(profile, 'fgjhidWSGHDSbgnkjsmashthegaffteasandcoffee', {
        expiresIn: "3d"
    });
};