const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const User = require("./User.js");
const Question = require("./Question.js");


const quizSchema = mongoose.Schema({
 
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  attemptedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz
