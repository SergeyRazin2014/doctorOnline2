const mongoose = require('mongoose');

let Schema = mongoose.Schema;

// let quiz1 = { name: 'Плохое самочувствие', number: 1, parentGroupNumber: [1] }

let quizSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        unique: true,
        required: true,
    },
    recommends: String,

    questions: [
        {
            name: {
                type: String,
                required: true,
            },
            number: Number,
        }
    ],
    diagnoses: {
        type: [
            {
                name: {
                    type: String,
                    required: true,
                },
                number: {
                    type: Number,
                    required: true,
                },
                keys: {
                    type: [{
                        type: String,
                        required: true,
                    }],
                    required: true,
                },
            }
        ],
        required: true,
    }
});

let eventModel = mongoose.model('Quiz', quizSchema);

module.exports = eventModel;