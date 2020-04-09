'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');

const login = (req, res) => {
    passport.authenticate('local', {session: false}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'That aint right',
                user   : user
            });
        }
        req.login(user, {session: false}, (e) => {
            if (e) {
                res.send(e);
            }
            const token = jwt.sign(user, 'asd');
            return res.json({user, token});
        });
    })(req, res);

};

module.exports = {
    login,
};