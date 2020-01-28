const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const SteamStrategy = require('passport-steam').Strategy;
const User = require('../models/users');
const creds = require("../models/credentials");
const jwt = require('jsonwebtoken');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

function createJwt(profile) {
    return jwt.sign(profile, creds.jwtSecret, {
        expiresIn: "3d"
    });
};

passport.use(new GoogleStrategy({
    clientID: creds.googleClientID,
    clientSecret: creds.googleClientSecret,
    callbackURL: "/users/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    // console.log(profile._json.picture);

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
                profilePicture: profile._json.picture,
                accessToken: createJwt({ user_name: profile.displayName })
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                done(null, newUser);
            });
        }
    });
}));

passport.use(new GitHubStrategy({
        clientID: creds.githubClientID,
        clientSecret: creds.githubClientSecret,
        callbackURL: "/users/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {

        User.findOne({ githubID: profile.id }).then((currentUser) => {
            if (currentUser) {
                // already have this user
                console.log('user is: ', currentUser);
                cb(null, currentUser);
            } else {
                // if not, create user in our db
                new User({
                    githubID: profile.id,
                    user_name: profile.username,
                    profilePicture: profile.photos[0].value,
                    accessToken: createJwt({ user_name: profile.username })
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    cb(null, newUser);
                });
            }
        });
    }
));

passport.use(new SteamStrategy({
        returnURL: 'http://localhost:8673/users/auth/steam/callback',
        realm: 'http://localhost:8673',
        apiKey: creds.steamAPIKey
    },
    function(identifier, profile, done) {
        console.log(profile._json.steamid);
        console.log(profile._json.personaname);
        console.log(profile._json.avatarfull);

        User.findOne({ steamID: profile._json.steamid }).then((currentUser) => {
            if (currentUser) {
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                new User({
                    steamID: profile._json.steamid,
                    user_name: profile._json.personaname,
                    profilePicture: profile._json.avatarfull,
                    accessToken: createJwt({ user_name: profile._json.personaname })
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    }
));