const fs = require('fs');
const path = require('path');

module.exports = {
    execute
}

function execute() {
    //корень проекта
    var appDir = path.dirname(require.main.filename);

    var appDir = path.dirname(require.main.filename);
    let filePath = path.join(appDir, 'data', 'problemGroups.txt');
    let text = fs.readFileSync(filePath, 'utf8').trim();

    let rows = text.split('\n');

    let arrResult = [];
    for (let i = 0; i < rows.length; i++) {
        let rowStr = rows[i];

        //создать объект subject
        let subject = createProblemGroup(rowStr);

        arrResult.push(subject);
    }

    return arrResult;
}

function createProblemGroup(rowStr) {
    let rowSplit = rowStr.split(':');

    let number = parseInt(rowSplit[0]);
    let name = rowSplit[1];
    let quizzesStr = rowSplit[2];

    if (quizzesStr.includes('\r')) {
        quizzesStr = quizzesStr.replace('\r', '');
    }

    let quizzes = quizzesStr.split(',');

    let subject = {
        number: number,
        name: name,
        quizNumbers: quizzes
    }

    return subject;
}