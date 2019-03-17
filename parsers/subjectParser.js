let fs = require('fs');
let path = require('path');

module.exports = {
    execute
};

function execute() {
    var appDir = path.dirname(require.main.filename);
    let filePath = path.join(appDir, 'data', 'subjects.txt');
    let text = fs.readFileSync(filePath, 'utf8').trim();
    let rows = text.split('\n');

    let arrResult = [];
    //для каждой строки в документе txt
    for (let i = 0; i < rows.length; i++) {
        let rowStr = rows[i];

        //создать объект subject
        let subject = createSubject(rowStr);

        arrResult.push(subject);
    }

    return arrResult;
}

function createSubject(rowStr) {
    let rowSplit = rowStr.split(':');

    let number = parseInt(rowSplit[0]);
    let name = rowSplit[1];
    let problemGroupsStr = rowSplit[2];

    if (problemGroupsStr.includes('\r')) {
        problemGroupsStr = problemGroupsStr.replace('\r', '');
    }

    let problemGroups = problemGroupsStr.split(',');

    let subject = {
        number: number,
        name: name,
        problemGroupsNumbers: problemGroups
    }

    return subject;
}









