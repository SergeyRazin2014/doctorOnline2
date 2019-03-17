const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const subjectSchema = new Schema({
    name: {
        type: String,
        unique: true,
    },
    number: {
        type: Number,
        unique: true
    },
    problemGroupsNumbers: [Number]
});

//создать модель
const eventModel = mongoose.model('Subject', subjectSchema);

//экспорт модельи
module.exports = eventModel;