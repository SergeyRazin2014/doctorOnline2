module.exports = {

    //главная страница
    showHome: (req, res) => {
        res.render('pages/home');
    },

    showAdminPage: (req, res) => {
        res.render('pages/adminPage');
    }
}