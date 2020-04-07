'use strict';
const passport = require('passport');
const passportJWT = require("passport-jwt");
const Strategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


passport.use(new Strategy(
    (username, password, done) => {
        try {

            const user = userModel.getUserLogin(username);
            console.log('Local strategy', user);

            if (user === undefined) {
                return done(null, false, {message: 'Incorrect email.'});
            }

            if (user.password !== password) {
                return done(null, false, {message: 'Incorrect password.'});
            }

            return done(null, {...user}, {message: 'Logged In Successfully'});
        } catch (e) {
            return done(e);
        }
    }));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'asd'
    },
    (jwtPayload, done) => {
        const user = userModel.getUser(JwtPayload.id);
        console.log('pl user', user);
        if (user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
}
));


module.exports = passport;