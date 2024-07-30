const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
    },
    questionType: {
        type: String,
        enum: ['multiple-choice','short-answer','true-false'],
        required: true
    },
    options: {
        type: Array,
    },
    correctAnswer: {
        type: String
    },
    marks: {
        type: Number,
        default: 0
    }
})

const Question = mongoose.model('Question', questionSchema);
module.exports = Question