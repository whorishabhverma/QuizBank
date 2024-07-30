const Connection = require("../Database/db.js");
const User = require('../Models/User.js');
const Admin = require('../Models/Admin.js');
const Quiz = require('../Models/Quiz.js');
const mongoose = require("mongoose");
const Result = require("../Models/Result.js");


const addUser = async (req, res) => {
  try {
    const { name, email, password, attemptedQuizes } = req.body;
    if (!name || !email || !password) {
      return res.status(422).json({ message: "Some Field is missing" });
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.json({ error: "User already Exist" });
    }

    const adminExist = await Admin.findOne({ email: email });

    if (adminExist) {
      return res.status(422).json({ message: "Already registered as Admin" });
    }

    const user = new User({ name, email, password });
    const userRegister = await user.save();
    console.log("function called")
    if (userRegister) {
      return res.status(201).json({ message: "User registered successfully" });
    } else return res.status(500).json({ message: "Cannot Register" });
  } catch (error) {
    console.log(error)
    return res.status(500).json(error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({ message: "Something is missing" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(200).json({ message: "User does not exist" });
    }

    const isPasswordValid = (await user.password) === password;
    if (!isPasswordValid) {
      return res.status(200).json({ message: "Invalid Password" });
    }
    console.log(user)
    return res
      .status(201)
      .json({ userInfo: user, message: "User login successfully" });
  } catch (error) {
    console.log("Some error occured during getting user", error);
  }
};




const saveUserResponse = async (req, res) => {
  try {
    const { userId, quizId, markedOptions, TimeTaken } = req.body;
    console.log('Req.body...    ', req.body);
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ status: 422, message: "User Not find" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.json({ status: 422, message: "quiz not found" });
    }
    const userIdObject = new mongoose.Types.ObjectId(userId);

    quiz.attemptedBy.push(userIdObject);
    const updatedQuiz = await quiz.save();
    console.log(updatedQuiz);

    const markedOptionsWithObjectId = markedOptions.map(option => ({
      question: new mongoose.Types.ObjectId(option.question),
      selectedOption: option.selectedOption
    }));

    user.attemptedQuizes.push({
      quiz: quizId,
      markedOptions: markedOptionsWithObjectId,
      TimeTaken: TimeTaken,
    });
    const updatedUser = await user.save();
    return res.json({ updatedUser });
  } catch (error) {
    console.log("Some Error occured during saving response", error);
  }
};


const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ status: 422, message: "User not found" });
    }

    const attemptedQuizes = user.attemptedQuizes;
    console.log(attemptedQuizes);
    const userHistory = await Promise.all(
      attemptedQuizes.map(async (attemptedQuiz) => {
        const quizId = attemptedQuiz.quiz;
        const quiz = await Quiz.findById(quizId);
        const isResultPublished = await Result.findOne({
          quiz: quizId,
          'users.userId': userId,
        });

        return {
          quizId: quiz._id,
          quizName: quiz.name,
          score: isResultPublished ? attemptedQuiz.score : 'Not available',
          duration: quiz.duration
        };
      })
    );

    return res.json({ status: 201, userHistory });
  } catch (error) {
    console.log('Some error Occured during getting user history', error)
  }
}

const getResult = async (req, res) => {
  try {
    const { userId, quizId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ status: 404, message: 'User not found' });
    }

    // Check if the quiz exists
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.json({ status: 404, message: 'Quiz not found' });
    }

    // Find the attempted quiz by the user
    const attemptedQuiz = user.attemptedQuizes.find(
      (attemptedQuiz) => attemptedQuiz.quiz.toString() === quizId
    );

    if (!attemptedQuiz) {
      return res.json({ status: 404, message: 'User has not attempted this quiz' });
    }

    // Extract marked options from the attempted quiz
    const markedOptions = attemptedQuiz.markedOptions || [];

    // Prepare the response data
    const quizDetails = quiz.questions.map((question) => {
      const userSelectedOption = markedOptions.find(
        (option) => option.question.toString() === question._id.toString()
      );

      return {
        question: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userSelectedOption: userSelectedOption ? userSelectedOption.selectedOption : null,
        score: attemptedQuiz.score
      };
    });

    return res.json({ status: 200, quizDetails });
  } catch (error) {
    console.error('Error getting user quiz details:', error);
    return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
}

module.exports = {
  addUser,
  getUser,
  saveUserResponse,
  getUserHistory,
  getResult
};
