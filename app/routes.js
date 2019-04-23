const auth = require('./middleware/auth');
const express = require('express');
const router = express.Router();
const mainController = require('./controllers/main.controller');
const authController = require('./controllers/auth.controller');
const userController = require('./controllers/user.controller');
const quizController = require('./controllers/quiz.controller');
const articleController = require('./controllers/article.controller');

//экспорт
module.exports = router;

//роуты
router.get('/', mainController.showHome);

router.get('/registration', authController.registration);
router.post('/registration', authController.addUser);

router.get('/login', authController.getLoginForm);
router.post('/login', authController.login);

router.get('/logout', authController.logOut);

router.get('/user', auth, userController.getUser);

router.get('/selectQuiz', auth, quizController.showSelect);

router.get('/getAllSubjects', auth, quizController.getAllSubjects);

router.get('/getAllProblemGroups', auth, quizController.getAllProblemGroups);

router.get('/getAllQuizzes', auth, quizController.getAllQuizzes);

router.get('/showAllQuizzes', auth, quizController.showAllQuizzes);

router.get('/quizInfo/:quizNumber', auth, quizController.getQuizInfo);

router.get('/quizEdit/:quizNumber', auth, quizController.getQuizEdit);

router.post('/quizEidt', auth, quizController.quizEdit);

router.get('/getQuiz/:quizNumber', auth, quizController.getQuiz);

router.get('/getQuizListByNumbers', auth, quizController.getQuizListByNumbers);

router.get('/goToQuizzing', auth, quizController.goToQuizzing);

router.get('/adminPage', auth, mainController.showAdminPage);

router.get('/showAllArticles', auth, articleController.showAllArticles);

router.get('/getArticle/:articleNumber', auth, articleController.getArticle);

router.get('/showArticle/:articleNumber', auth, articleController.showArticle);

router.get('/getAddArticleForm', auth, articleController.getAddArticleForm);

router.post('/addNewArticle', auth, articleController.addNewArticle);

router.get('/getArticleEditForm/:articleNumber', articleController.getArticleEditForm)

router.post('/editArticle', articleController.editArticle);

router.delete('/deleteArticle', articleController.deleteArticle);

router.post('/uploadArticleImg',articleController.uploadArticleImg);

router.get('/getImg/:imgName', auth, articleController.getImg);
