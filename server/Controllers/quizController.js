const mongoose = require("mongoose");
const Admin = require("../Models/Admin.js");
const Quiz = require("../Models/Quiz.js");
const User = require("../Models/User.js");
const Question = require("../Models/Question.js");
const { Types: mongooseTypes } = require("mongoose");
const Result = require("../Models/Result.js");


const { ObjectId } = mongooseTypes;


const addQuiz = async (req, res) => {
  try {
    const {
      name,
      description,
      dateCreated,
      startTime,
      endTime,
      duration,
      createdBy,
      attemptedBy,
      questions,
    } = req.body;

    if (
      !name ||
      !dateCreated ||
      !startTime ||
      !endTime ||
      !duration ||
      !createdBy ||
      !questions
    ) {
      return res.json({ status: 422, message: "Something is missing" });
    }
    const questionIds = await Promise.all(
      questions.map(async (question, i) => {
        const newQuestion = new Question(question);
        const savedQuestion = await newQuestion.save();
        return savedQuestion._id;
      })
    );

    const quiz = new Quiz({
      name,
      description,
      dateCreated,
      startTime,
      endTime,
      duration,
      createdBy,
      attemptedBy,
      questions: questionIds,
    });

    const savedQuiz = await quiz.save();

    if (savedQuiz) {
      const quizId = savedQuiz._id;

      const adminId = savedQuiz.createdBy;
      const admin = await Admin.findById(adminId);

      if (!admin) {
        return res.json({ status: 422, message: "Admin not found" });
      }

      admin.createdQuizes.push(quizId);
      // Save the updated admin document
      await admin.save();

      return res.status(201).json({
        quiz: savedQuiz,
        quizId: quizId,
        message: "Quiz created successfully",
      });
    }
    return res
      .status(422)
      .json({ message: "Some error occured during adding quiz" });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ message: "Some error occured during adding quizz" });
  }
};

const getQuiz = async (req, res) => {
  try {
    const quizId = req.body.quizId;
    const isValidQuiz = await Quiz.findById(quizId);
    if (!isValidQuiz) {
      console.log("here");
      return res.json({ status: 422, message: "Invalid QuizId" });
    }

    const quiz = await Quiz.findById(quizId)
      .populate("createdBy", "name")
      .populate("attemptedBy", "name")
      .populate("questions", "");

    if (!quiz) {
      return res.json({ status: 422, message: "Quiz Not Found" });
    }

    return res.status(201).json({ quiz });
  } catch (error) {
    return res.json({
      status: 422,
      message: "Some error occured while getting quiz",
    });
  }
};

const getQuizzes = async (req, res) => {
  try {
    const { quizIds } = req.body;
    console.log(quizIds);
    if (!quizIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.json({ status: 422, message: "Invalid QuizId" });
    }

    const quizzes = await Quiz.find({ _id: { $in: quizIds } })
      .populate("createdBy", "name")
      .populate("attemptedBy", "name");

    if (!quizzes || quizzes.length === 0) {
      return res.json({ status: 422, message: "No quizzes found" });
    }

    return res.status(200).json({ quizzes });
  } catch (error) {
    console.log("Some error occured during getting quiz array", error);
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;

    if (!quizId) {
      return res.json({ status: 422, message: "QuizId is missing" });
    }


    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.json({ status: 422, message: "Cannot find Quiz" });
    }
    const response = await Quiz.deleteOne({ _id: quizId });
    if (response.deletedCount === 0) {
      return res.json({ status: 422, message: "Cannot find Quiz" });
    }

    const questionIds = quiz.questions.map((question) => question._id);
    await Question.deleteMany({ _id: { $in: questionIds } });

    const admin = await Admin.findOne({
      _id: quiz.createdBy,
    });
    await Admin.updateOne(
      { _id: admin._id },
      { $pull: { createdQuizes: { _id: new ObjectId(quizId) } } }
    );

    await User.updateMany(
      { "attemptedQuizes.quiz": quizId },
      { $pull: { attemptedQuizes: { quiz: quizId } } }
    );

    const result = await Result.deleteOne({ quiz: quizId });
    if (result.deletedCount === 0) {
      return res.json({ status: 422, message: "Result cannot be deleted" });
    }

    return res.json({ status: 201, message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ status: 422, message: "Cannot delete Quiz" });
  }
};

const calculateScores = async (req, res) => {
  try {
    const { quizId } = req.body;
    const quiz = await Quiz.findById(quizId).populate({
      path: "attemptedBy",
      populate: {
        path: "attemptedQuizes.quiz",
        model: "Quiz",
        populate: {
          path: "questions",
          model: "Question",
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    await Promise.all(
      quiz.attemptedBy.map(async (user) => {
        let score = 0;

        // Get the filtered questions for the specific quiz
        const filteredQuestions = user.attemptedQuizes
          .filter((attemptedQuiz) => attemptedQuiz.quiz._id.toString() === quizId)
          .map((attemptedQuiz) => attemptedQuiz.quiz.questions)
          .flat();

        // Get the marked options for the specific quiz
        const markedOptions = user.attemptedQuizes
          .filter((attemptedQuiz) => attemptedQuiz.quiz._id.toString() === quizId)
          .map((attemptedQuiz) => attemptedQuiz.markedOptions)
          .flat();

        // Iterate through the questions and calculate score
        filteredQuestions.forEach((question) => {
          const userSelectedOption = markedOptions.find(
            (option) => option.question.toString() === question._id.toString()
          );

          if (
            userSelectedOption &&
            userSelectedOption.selectedOption === question.correctAnswer
          ) {
            score += question.marks;
          }
        });

        // Update the user's score in the database
        const index = user.attemptedQuizes.findIndex(
          (attemptedQuiz) => attemptedQuiz.quiz._id.toString() === quizId
        );

        if (index !== -1) {
          user.attemptedQuizes[index].score = score;
          await user.save();
        }
      })
    );

    return res
      .json({ status: 201, message: "Scores calculated and updated successfully" });
  } catch (error) {
    console.error("Error calculating scores:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addQuiz,
  getQuiz,
  getQuizzes,
  deleteQuiz,
  calculateScores
};