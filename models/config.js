const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const SteamStrategy = require('passport-steam').Strategy;
const User = require('../models/users');
const passport = require('passport');
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
    return jwt.sign(profile, process.env.JWTSECRET, {
        expiresIn: "3d"
    });
};

passport.use(new GoogleStrategy({
    clientID: process.env.googleClientID,
    clientSecret: process.env.googleClientSecret,
    callbackURL: "/users/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {

    User.findOne({ googleID: profile.id }).then((currentUser) => {
        if (currentUser) {
            // already have this user
            console.log('user already existing: ', currentUser);
            currentUser.accessToken = createJwt({user_name: currentUser.user_name});
            console.log(`New access token: ${currentUser.accessToken}`);
            currentUser.save();
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
        clientID: process.env.githubClientID,
        clientSecret: process.env.githubClientSecret,
        callbackURL: "/users/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {

        User.findOne({ githubID: profile.id }).then((currentUser) => {
            if (currentUser) {
                // already have this user
                console.log('user is: ', currentUser);
                currentUser.accessToken = createJwt({user_name: currentUser.user_name});
                console.log(`New access token: ${currentUser.accessToken}`);
                currentUser.save();
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
        apiKey: process.env.steamAPIKey
    },
    function(identifier, profile, done) {
        console.log(profile._json.steamid);
        console.log(profile._json.personaname);
        console.log(profile._json.avatarfull);

        User.findOne({ steamID: profile._json.steamid }).then((currentUser) => {
            if (currentUser) {
                // already have this user
                console.log('user is: ', currentUser);
                currentUser.accessToken = createJwt({user_name: currentUser.user_name});
                console.log(`New access token: ${currentUser.accessToken}`);
                currentUser.save();
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