//загрузка переменных окружения
require('dotenv').config();

//подключаем зависимости
const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const loadUser = require('./app/middleware/loadUser');
const Subject = require('./app/models/subject')
const ProblemGroup = require('./app/models/problemGroup');
const Quiz = require('./app/models/quiz');
const dataFiler = require('./dataFiller');
const helpers = require('./helpers');
const fs = require('fs');
const parsers = require('./parsers');
const fileHelper = require('./helpers/fileHelper');

//--------------☻
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
//--------------


//установка конфигурации приложения=======================================================

//СТАТИЧ ФАЙЛЫ
app.use('/', express.static(path.join(__dirname, 'static/dest/')));
//БИБЛИОТЕКА JQUERY
app.use('/', express.static(path.join(__dirname, 'node_modules/jquery/dist/')));
//VENDOR
app.use('/', express.static(path.join(__dirname, 'static/vendor/')));
//IMG
app.use('/', express.static(path.join(__dirname, 'static/img/')));
//UPLOADS
app.use('/', express.static(path.join(__dirname, 'static/uploads/')));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: process.env.DB_URI,
    })
}));

//установить ejs - как движек приложения
app.set('view engine', 'ejs');
app.use(expressLayouts);



// let gfs;
// mongoose.connection.once('open', () => {
//     gfs = Grid(mongoose.connection.db, mongoose.mongo);
//     gfs.collection('uploads');
// });

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
app.use(loadUser); //устанавливаем юзера из сессии в респонс чтобы user был доступен всем ejs шаблонам

//установка роутов=========================================================================
app.use(require('./app/routes'))



//запуск сервера===========================================================================
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});

//****************************************************************** */
//МОНГУСТ ТЕСТИРОВАНИЕ

//корень проекта
// let appDir = path.dirname(require.main.filename);
// let filePath = path.join(appDir, 'data', 'quizzes_error', '15 windows1251.txt');

// let encoding = fileHelper.getEncoding(filePath);
// fileHelper.convertEncodingToUtf8(filePath);

//let quiz = parsers.quizParser.execute(filePath);
//dataFiler.fillAllData();


//****************************************************************** */


