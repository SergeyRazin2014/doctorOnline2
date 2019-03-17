const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const problemGroupSchema = new Schema({
    //{ name: 'Проблемы общего характера', number: 1, parentSubjectNumber: [1, 2] }

    name:String,
    number:{
        type:Number,
        unique:true
    },
    quizNumbers: [Number]
});

//создать модель
const eventModel = mongoose.model('ProblemGroup', problemGroupSchema);

//экспорт модели
module.exports = eventModel;