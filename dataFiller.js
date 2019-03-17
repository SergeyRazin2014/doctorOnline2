let parsers = require('./parsers');
let models = require('./app/models/');
let fs = require('fs');
let helpers = require('./helpers')
let path = require('path');

module.exports = {
    fillQuizStub,
    fillQuizFile,
    fillAllData,
}

let quizz = {
    name: 'Свистящее дыхание',
    number: 88,
    recommends: "рекомандация: сходи к врачу",
    questions: [
        {
            name: "Вы откашливаете пенистую розовую или белую мокроту?",
            number: 101,
        },
        {
            name: 'Свистящее дыхание появилось за последние несколько часов?',
            number: 102,
        },
        {
            name: 'Ваше дыхание настолько затруднено, что Вы задыхаетесь',
            number: 103,
        },
        {
            name: 'У вас температура 38 и выше?',
            number: 104,
        },
        {
            name: 'Вы давно откашливаете серую или зеленовато-желтую мокроту?',
            number: 105,
        },
        {
            name: 'У Вас обычно свистящее дыхание?',
            number: 106,
        }
    ],
    diagnoses: [
        {
            name: 'Возможен опасный застой жидкости в легких, вероятно, в результате заболевания сердца',
            number: 1,
            key: ['10111021']
        },
        {
            name: 'Свистящее дыхание, возможно, вызвано приступом астмы',
            number: 2,
            key: ['1021']
        },
        {
            name: 'Экстренный случай! Немедленно вызовите скорую помощь',
            number: 3,
            key: ['10211031']
        },
        {
            name: 'Острый бронхит - инфекционное поражение стенок бронхов',
            number: 4,
            key: ['1041']
        },
        {
            name: 'Хронический бронхит (стойкое воспаление стенок бронхов)',
            number: 5,
            key: ['10511061']
        }
    ]
}

function fillQuizStub() {
    Quiz.create(quizz).then((data) => {
        console.log('done');
        console.log(data);
    })
}

function fillQuizFile(filePath) {

    let quiz = parsers.quizParser.execute(filePath);

    Quiz.create(quiz).then((data) => {
        console.log(data);
    });
}



/**
 * ЗАГРУЗКА ВСЕХ ТЕСТОВ
 */
function fillAllData() {

    //корень проекта
    let appDir = path.dirname(require.main.filename);
    let quizzesFolder = path.join(appDir, 'data', 'TESTS');

    //let quizzesFilesPaths = helpers.fileHelper.getAllTxtFiles('D:/111DOWNLOAD/ТЕСТЫ/TEMP');

    let quizzesFilesPaths = helpers.fileHelper.getAllTxtFiles(quizzesFolder);

    let quizList = [];
    quizzesFilesPaths.forEach(fpath => {
        let quiz = parsers.quizParser.execute(fpath);
        quizList.push(quiz);

        //валидирую модель
        let newQuiz = new models.Quiz(quiz);
        let err = newQuiz.validateSync();
        if (err) {
            console.log(err);
        }

    });

    let problemGroups = parsers.problemGroupParser.execute();
    let subjects = parsers.subjectParser.execute();


    problemGroups.forEach((probGroup) => {
        let newProbGroup = new models.ProblemGroup(probGroup);

        let err = newProbGroup.validateSync();

        if (err) {
            console.log(err);
        }
    })

    subjects.forEach(s => {
        let newSubject = new models.Subject(s);
        let err = newSubject.validateSync();
        if (err) {
            console.log(err);
        }
    })

    //сохраняю в базу данные
    models.Quiz.create(quizList).then(() => {
        models.ProblemGroup.create(problemGroups);
    }).then(() => {
        models.Subject.create(subjects);
    }).then(() => {
        console.log('DONE');
    }).catch((err, data) => {
        console.log(err);
    });




}





