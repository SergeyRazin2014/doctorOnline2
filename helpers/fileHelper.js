const fs = require('fs');
const path = require('path');
const chardet = require('chardet');
var iconv = require('iconv-lite');

module.exports = {
    getAllFiles,
    getAllTxtFiles,
    copyFileQuizzes: copyAllTxtFiles,
    getEncoding,
    convertEncodingToUtf8,
    convertAllFilesToUtf8
}

/**
 * получить все файлы из папки рекурсивно
 * @param {*} dir - путь к папке из которой нужно получить полные пути файлов рекурсивно
 */
function getAllFiles(dir, filelist) {
    var path = path || require('path');
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = getAllFiles(path.join(dir, file), filelist);
        }
        else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
};

/**
 * получить все полные пути txt файлов из папки рекурсивно
 * @param {*} dir - путь к папке из которой нужно получить все txt файлы
 */
function getAllTxtFiles(dir) {
    let allFiles = getAllFiles(dir);
    let result = allFiles.filter(f => f.endsWith('.txt'));
    return result;
}

/**
 * Скопировать файлы txt рекурсивно из одной папки в другую
 * @param {String} sourceFolderPath - папка откуда
 * @param {String} destDir - папка куда
 */
function copyAllTxtFiles(sourceFolderPath, destDir) {

    let allQuizzesPath = getAllTxtFiles(sourceFolderPath);

    allQuizzesPath.forEach(quizPath => {

        let fileName = path.basename(quizPath);
        let destFileFullName = path.join(destDir, fileName);

        fs.copyFileSync(quizPath, destFileFullName);
    });
}

/**
 * получить кодировку файла
 * @param {String} filePath 
 */
function getEncoding(filePath) {
    let result = chardet.detectFileSync(filePath);
    return result;
}

/**
 * преобразовать кодировку файла на UTF-8
 * @param {String} filePath 
 */
function convertEncodingToUtf8(filePath) {

    var originalEncoding = getEncoding(filePath);

    let buffer = fs.readFileSync(filePath);

    let str = iconv.decode(buffer, 'win1251');

    fs.writeFileSync(filePath, str, 'UTF-8');
}


/**
 * конвертировать все файлы в папке в кодировку UTF-8
 * @param {String} folderPath 
 */
function convertAllFilesToUtf8(folderPath) {
    let allFiles = getAllTxtFiles(folderPath);

    allFiles.forEach(filePath => convertEncodingToUtf8(filePath));
}