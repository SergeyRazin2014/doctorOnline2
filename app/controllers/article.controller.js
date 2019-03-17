const models = require('../models');
const uploader = require('./infrastructure/uploader');

module.exports = {
    showAllArticles: async function (req, res) {

        let allArticles = await models.Article.find({}).sort({ 'number': 1 });

        res.render('pages/articles/allArticles', { allArticles });
    },

    //☻
    getArticle: function (req, res) {

        let articleNumber = req.params['articleNumber'];

        //☻
        let article = {
            name: 'Имя тестовой статьи',
            number: 1,
            text: 'lorem @media для создания брейкпойнтов контента и интерфейсов. Эти брейкпойнты в основном сделаны на минимальных широтах зоны просмотра и позволяют масштабировать элементы по мере изменения размера зоны просмотра.',
        }

        return res.render('pages/articles/article.ejs', { article });
    },

    showArticle: async function (req, res) {
        let articleNumber = req.params['articleNumber'];

        let article = await models.Article.findOne({ number: articleNumber });

        res.render('pages/articles/article.ejs', { article });
    },

    getAddArticleForm: function (req, res) {
        res.render('pages/articles/addNewArticleForm');
    },

    addNewArticle: async function (req, res) {

        //найти максимальный номер статьи
        let articleWithMaxNumber = await models.Article.find({}).sort({ 'number': -1 }).limit(1);
        let articleNewNumber;

        if (articleWithMaxNumber && articleWithMaxNumber.length > 0) {
            articleNewNumber = articleWithMaxNumber[0].number + 1;
        } else {
            articleNewNumber = 1;
        }

        //сохранить статью в базу данных
        let name = req.body.articleName;
        let text = req.body.articleText;

        let article = new models.Article({ number: articleNewNumber, name, text });
        article.save();

        //отправить на страницу со всеми статьями
        res.redirect('/showAllArticles');
    },

    getArticleEditForm: async function (req, res) {

        let articleNumber = req.params['articleNumber'];

        let article = await models.Article.findOne({ number: articleNumber });

        res.render('pages/articles/articleEditForm', { article });
    },

    editArticle: async function (req, res) {

        //todo: сохранить измененную статью
        //отправить на клиента что все хорошо

        let number = req.body.number;
        let name = req.body.name;
        let text = req.body.text;

        let article = { number, name, text };

        let result = await models.Article.findOneAndUpdate({ number: number }, article);

        res.json(result);
    },

    deleteArticle: async function (req, res) {
        let number = req.body.articleNumber;

        await models.Article.findOneAndDelete({ number: number });

        res.json({ message: `статья ${number} удалена` });
    },



    uploadArticleImg: function (req, res) {

        uploader.upload(req, res, err => {
            let error = '';
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    error = 'Картинка не более 6mb!';
                }
                if (err.code === 'EXTENTION') {
                    error = 'Только jpeg и png!';
                }
            }

            res.json({
                ok: !error,
                error,
                imgName: req.file.filename
            });
        });
    }


}