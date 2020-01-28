const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/users');
const creds = require("../models/credentials");

passport.use(new GoogleStrategy({
    clientID : creds.googleClientID,
    clientSecret: creds.googleClientSecret,
    callbackURL: "/auth/google/callback"
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
