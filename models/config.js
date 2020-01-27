const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/users');
const axios = require('axios')


passport.use(new GoogleStrategy({
    clientID : "242136715571-79vhd6vdnm800tpbklnj0d3r8bb2ebkc.apps.googleusercontent.com",
    clientSecret: "TAn1svEkvKqXr5U94VItOL0h",
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

    // done();
})
);


function checkIfExisting(searchID) {
    return new Promise((resolve, reject) => {
        User.findOne({googleID: searchID}, (err, foundUser) => {
            if (err) {
                reject(err);
                res.send(err);
            } else {
                if (foundUser) {
                    console.log(foundUser);
                    console.log("user already existing");
                    resolve(null);
                } else {
                    console.log("user not existing yet");
                    resolve(true);
                }
            }
        });
    });
}