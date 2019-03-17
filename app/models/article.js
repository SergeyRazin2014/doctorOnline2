const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const articleSchema = new Schema({
    name: String,
    number: {
        type: Number,
        unique: true
    },
    text: String
});

//создать модель
const eventModel = mongoose.model('Article', articleSchema);

//экспорт модели
module.exports = eventModel;