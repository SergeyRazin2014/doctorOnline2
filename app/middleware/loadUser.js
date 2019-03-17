const User = require('../models/user');


function loadUser(req, res, next) {

    req.user = null;
    res.locals.user = null;

    if (!req.session.user) {
        return next();
    } else {
        req.user = req.session.user;
        res.locals.user = req.session.user;
    }

    next();
}

module.exports = loadUser;