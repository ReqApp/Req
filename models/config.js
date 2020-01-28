const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/users');
const creds = require("../models/credentials");

passport.use(new GoogleStrategy({
    clientID : creds.googleClientID,
    clientSecret: creds.googleClientSecret,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);

    checkIfExisting(profile.id).then((output) => {
        if (output) {
            let newUser = new User();
            newUser.user_name = profile.displayName;
            newUser.googleID = profile.id;
        
            newUser.save((err) => {
                if (err) {
                    throw new err;
                }
            });
            /**
             * MUST BE CHANGED BEFORE RELEASE
             */
            axios.post('http://localhost:8673/users/createOAuthAccount', {
                displayName: newUser.user_name,
                googleID: newUser.googleID
              }).then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });

        }

        done();
    });
}));