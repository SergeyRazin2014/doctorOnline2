//todo: заменить на models - все require(...)
const Subject = require('../models/subject');
const ProblemGroup = require('../models/problemGroup');
const Quiz = require('../models/quiz');
const models = require('../models');


module.exports = {
    showSelect: function (req, res) {
        res.render('pages/quizSelect')
    },

    getAllSubjects: async function (req, res) {
        let result = await Subject.find({});
        res.json(result);
    },

    getAllProblemGroups: async function (req, res) {
        let result = await ProblemGroup.find({});

        res.json(result);
    },

    getAllQuizzes: async function (req, res) {
        //выбираем тесты согласно списка номеров и берем только номер и имя теста
        let quizes = await models.Quiz.find({}, { number: 1, name: 1 });

        res.json(quizes);
    },

    showAllQuizzes: async function (req, res) {

        let allQuizzes = await models.Quiz.find({}).sort('number');

        res.render('pages/quizEditing/allQuizzes.ejs', { allQuizzes: allQuizzes });
    },

    getQuizInfo: async function (req, res) {
        let quizNumber = req.params['quizNumber'];

        let quiz = await models.Quiz.findOne({ number: quizNumber });

        res.render('pages/quizEditing/quizInfo.ejs', { quiz: quiz });
    },

    getQuizEdit: async function (req, res) {

        let quizNumber = req.params['quizNumber'];

        let quiz = await models.Quiz.findOne({ number: quizNumber });

        res.render('pages/quizEditing/quizEdit.ejs', { quiz: quiz })
    },

    quizEdit: async function (req, res) {
        try {

            let newQuiz = req.body;

            let modelForValid = new models.Quiz(newQuiz);
            let err = modelForValid.validateSync();
            if (err) {
                console.log(err);
            }

            let result = await models.Quiz.findOneAndUpdate({ number: newQuiz.number }, newQuiz);

            if (result) {
                res.json(result);
            } else {
                res.sendStatus(500);
            }
        } catch (err) {
            res.sendStatus(500).send(err);
        }
    },

    getQuiz: async function (req, res) {
        let quizNumber = req.params['quizNumber'];

        let quiz = await models.Quiz.findOne({ number: quizNumber });

        res.json(quiz);
    },

    getQuizListByNumbers: async function (req, res) {

        let quizNumbers = req.query.quizNumbers;

        //выбираем тесты согласно списка номеров
        let quizes = await models.Quiz.find({ 'number': { $in: quizNumbers } });

        res.json(quizes);
    },

    goToQuizzing: function (req, res) {

        let quizNumbers = JSON.parse(req.query.quizNumbers);

        return res.render('pages/quizzing.ejs', { quizNumbers });
    },

    

}