

function auth(req, res, next) {
    let login = req.session.login;
    let isAuth = req.session.isAuth;

    if (!isAuth) {
        return res.status(401).send('Доступ запрещен.');
    } else {
        next();
    }

}

module.exports = auth;