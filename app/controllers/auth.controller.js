const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');

let ob = {

    registration: (req, res) => {
        res.render('pages/registration');
    },

    getLoginForm: (req, res) => {
        res.render('pages/login');
    },

    login: function (req, res) {
        let login = req.body.login;
        let passw = req.body.password;

        ob.findUserByLogin(login).then((u) => {
            if (u) {
                var isPasswCorrect = bcrypt.compareSync(passw, u.password);
                if (isPasswCorrect) {
                    req.session.login = u.login;
                    req.session.isAuth = true;
                    req.session.user = u;
                    return res.redirect('/');
                } else {
                    res.send('Неверный логин или пароль!')
                }
            } else {
                res.send('Неверный логин или пароль!')
            }
        }).catch(err => {
            console.log('error: ' + err);
            res.send('error' + err);
        })
    },

    addUser: (req, res) => {

        //todo: добавить проверку на уникальность логина

        let login = req.body.login;
        let passw = req.body.password;
        let confirmPassw = req.body.confirmPassword

        let passwSecure = bcrypt.hashSync(passw);

        let user = new User({ login: login, password: passwSecure });
        let u = user.save().then((u) => {
            req.session.login = u.login;
            req.session.isAuth = true;
            req.session.user = u;
            return res.redirect('/');
        }).catch((err)=>{
            console.log(err);
        })
    },
    
    findUserByLogin: function (login) {

        let promise = User.findOne({ 'login': login }).exec();
        return promise;
    },

    logOut: (req, res) => {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                } else {
                    return res.redirect('/');
                }
            });
        }
    }

}

module.exports = ob;