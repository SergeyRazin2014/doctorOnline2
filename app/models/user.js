const mongoose = require('mongoose');

let Schema = mongoose.Schema;

//создать схему
const userSchema = new Schema({
    login: {
        type: String,
        unique: true
    },
    password: String,
    role:{
        type:String,
        enum: ['user','admin'],
        default:'user',
    }
})



//создать модель
const eventModel = mongoose.model('User',userSchema);

//экспорт модельи
module.exports = eventModel;