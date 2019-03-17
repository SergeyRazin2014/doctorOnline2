const fs = require('fs');
const path = require('path');
const endOfLine = require('os').EOL;



module.exports = {
    execute
}

/**
 * распарсить файл Quiz.txt (имя файла должно быть вида: 1.txt, 10.txt ...)
 * @param {String} - filePath: путь к файлу quiz.txt
 * @return Quiz
 */
function execute(filePath) {


    let text = readFile(filePath);

    let quizNumber = parseInt(path.basename(filePath));
    let quizName = getQuizName(quizNumber);
    let diagnoses = getDiagnoses(text, quizNumber, quizName);
    let questions = getQuestion(text);
    let recomendesText = getRecomendesText(text);

    let quiz = {
        name: quizName,
        number: quizNumber,
        recommends: recomendesText,
        questions: questions,
        diagnoses: diagnoses,
    }

    return quiz;
}

function getQuizName(quizNumber) {
    let quizzesNames = parseQuizzNames();
    let quizName = quizzesNames.find(x => x.number == quizNumber).name;
    return quizName;
}

function parseQuizzNames() {
    let appDir = path.dirname(require.main.filename);
    let filePath = path.join(appDir, 'data', 'quizzesNames.txt');

    let text = fs.readFileSync(filePath, 'utf8');
    let rows = text.split('\n');

    let resList = [];

    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];

        if (!row) continue;

        row = row.replace('\r', '').trim();

        let ob = getNameNumberObj(row);

        resList.push(ob);
    }

    return resList;

}

// function getQuestion(namesBlock) {
function getQuestion(text) {

    let blocks = text.split('[');
    let namesBlock = blocks.find(b => b.startsWith('names]'))

    let questionRows = getQuestionRows(namesBlock);
    let resList = [];

    for (let i = 0; i < questionRows.length; i++) {
        let row = questionRows[i];
        let ob = getNameNumberObj(row);

        resList.push(ob);
    }

    return resList;
}



/**
 * получить массив объектов диагнозов 
 * @param {String} namesBlock - текстовый блок с диагнозами и вопросами
 * @returns [{number, name},{number, name}]
 */
//function getDiagnoses(namesBlock) {
function getDiagnoses(text, quizNumber, quizName) {

    let blocks = text.split('[');
    let namesBlock = blocks.find(b => b.startsWith('names]'));

    if (!namesBlock) throw new Error('Блок [names] должен присутствовать в документе');


    let diagnosKeyBlock = blocks.find(b => b.startsWith('diagnoses]'));
    if (!diagnosKeyBlock) throw new Error('Блок [diagnoses] должен присутствовать в документе')



    let diagnosesRows = getDiagnosesRows(namesBlock);
    let diagnosesKeysRows = getDiagnosesKeysRows(diagnosKeyBlock);

    //if (diagnosesRows.length != diagnosesKeysRows.length) throw new Error('Количество диагнозов и количество ключей не совпадает');

    let obDiagnosesKeyAll = getNameNumberObjAll(diagnosesKeysRows);

    let resList = [];

    for (let i = 0; i < diagnosesRows.length; i++) {
        let diagnosRow = diagnosesRows[i];
        let diagnosKeyRows = diagnosesKeysRows[i];

        let obDiagnoses = getNameNumberObj(diagnosRow);
        let diagnosKeyObjects = obDiagnosesKeyAll.filter(x => x.number == obDiagnoses.number);

        if (!diagnosKeyObjects || diagnosKeyObjects.length == 0) throw new Error(`Тест номер: ${quizNumber}: '${quizName}'; Диагноз: ${obDiagnoses.number}:${obDiagnoses.name}. Для текста диагноза не найден ключ`);

        obDiagnoses.keys = diagnosKeyObjects.map(x => x.name);

        if (!obDiagnoses.keys || obDiagnoses.keys.length == 0) throw new Error(`Тест номер: ${quizNumber}: '${quizName}'; Диагноз: ${obDiagnoses.number}:${obDiagnoses.name}. Для текста диагноза не найден ключ`);
        if (obDiagnoses.keys.some(x => !x)) throw new Error(`Тест номер: ${quizNumber}: '${quizName}'; Диагноз: ${obDiagnoses.number}:${obDiagnoses.name}. Для текста диагноза не заполнен ключ`)

        resList.push(obDiagnoses);
    }
    return resList;
}



function getDiagnosesRows(namesBlock) {

    let diagnosesFirstIndex = namesBlock.indexOf('names]');
    let diagnosesLastIndex = namesBlock.indexOf('101:');

    let diagnosesBlock = namesBlock.substring(diagnosesFirstIndex, diagnosesLastIndex);
    diagnosesBlock = diagnosesBlock.replace('names]', '').trim();

    let diagnosesRows = diagnosesBlock.split('\n');

    let resList = [];

    for (let i = 0; i < diagnosesRows.length; i++) {

        let row = diagnosesRows[i];

        row = row.replace('\r', '').trim();

        let search = row.search(/^[0-9].+[:].+$/i);

        if (search < 0) {
            resList[resList.length - 1] = resList[resList.length - 1] + endOfLine + row;
            continue;
        }


        if (row) {
            resList.push(row);
        }
    }

    return resList;
}

function getQuestionRows(namesBlock) {
    let questionFirstIndex = namesBlock.indexOf('101:');
    let questionBlock = namesBlock.substring(questionFirstIndex);

    let questionRows = questionBlock.split('\n');

    let resList = [];

    for (let i = 0; i < questionRows.length; i++) {
        let row = questionRows[i];

        row = row.replace('\r', '').trim();

        let search = row.search(/^[0-9].+[:].+$/i);

        if (search < 0) {
            resList[resList.length - 1] = resList[resList.length - 1] + endOfLine + row;
            continue;
        }

        if (row) {
            resList.push(row);
        }
    }

    return resList;

}

function getDiagnosesKeysRows(diagnosKeyBlock) {
    diagnosKeyBlock = diagnosKeyBlock.replace('diagnoses]', '').trim();

    let diagKeysRows = diagnosKeyBlock.split('\n');

    let resList = [];

    diagKeysRows.forEach(row => {
        //row = row.replace('\r', '').replace(/,/g, '').replace(/;/g, '').trim();
        row = row.replace('\r', '').trim();

        if (row) {
            resList.push(row);
        }
    });

    return resList;
}

function getRecomendesText(text) {

    let blocks = text.split('[');
    let recomendesBlock = blocks.find(b => b.startsWith('recommends]'));

    if (!recomendesBlock) return null;

    recomendesBlock = recomendesBlock.replace('recommends]', '').trim();
    return (recomendesBlock);


}

/**
 * на основе строки:   "11:Экстренный случай."    создать объект {number:11, name:Экстренный случай.}
 * @param {String} row - строка вида: "11:Экстренный случай."
 * @return {Object} - {number, name}
 */
function getNameNumberObj(row) {

    let regexpNumber = /^[0-9]+[:]/i;

    let numberMatch = row.match(regexpNumber);
    let number = undefined;
    let name = row.replace(regexpNumber, '');

    if (numberMatch) {
        number = numberMatch[0];
        number = number.replace(':', "");
        number = parseInt(number);
    }

    let result = { name, number };

    return result;
}

function getNameNumberObjAll(rowList) {
    let resList = [];
    for (let i = 0; i < rowList.length; i++) {
        let row = rowList[i];
        let ob = getNameNumberObj(row);
        resList.push(ob);
    }

    return resList;

}

function readFile(filePath) {
    let text = fs.readFileSync(filePath, 'utf8').trim();
    return text;
}