const mongoose = require("mongoose");
const Quiz = require('./Quiz.js');
const { Schema } = require("mongoose");
const User = require("./User.js");

const resultSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    users: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            score: {
                type: Number,
                default: 0
            },
            TimeTaken: {
                type: Number,
                default: 0
            }
        }
    ]
})

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;