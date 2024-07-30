const User = require('../Models/User.js')
const Admin = require('../Models/Admin.js')
const Quiz = require('../Models/Quiz.js')
const Result = require('../Models/Result.js')
const mongoose = require('mongoose');

const addAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({ error: "Something is missing" });
    }

    const adminExist = await Admin.findOne({ email: email });

    if (adminExist) {
      return res.status(422).json({ error: "Admin already registered" });
    }

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.json({ error: "Alreday registered as User" });
    }

    const admin = new Admin({ name, email, password });
    const adminRegister = await admin.save();

    if (adminRegister) {
      return res.status(201).json({ message: "Admin registered successfully" });
    }
    return res.status(422).json({ error: "Cannot registered Admin" });
  } catch (error) {
    console.log("Error while adding admin", error);
  }
};

const getAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({ message: "Something is missing" });
    }

    const admin = await Admin.findOne({ email: email });

    if (!admin) {
      return res.status(200).json({ message: "Admin does not exist" });
    }

    const isPasswordValid = (await admin.password) === password;
    if (!isPasswordValid) {
      return res.status(200).json({ message: "Invalid Password" });
    }

    const quizHistory = await Quiz.find({ createdBy: admin._id });
    const quizIds = quizHistory.map((quiz) => quiz._id);
    return res.status(201).json({
      adminId: admin._id,
      adminName: admin.name,
      adminEmail: admin.email,
      quizIds: quizIds,
      message: "Admin login successfully",
    });
  } catch (error) {
    console.log("Some error occured while getting admin", error);
  }
};



const publishResult = async (req, res) => {
  try {
    const { adminId, userIds, quizId } = req.body;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.json({ status: 422, message: "Admin not found" });
    }
    console.log(adminId, userIds, quizId);
    const quizInAdmin = admin.createdQuizes.find(
      (q) => q._id.toString() === quizId
    );
    if (!quizInAdmin) {
      return res.json({
        status: 422,
        message: "Quiz Not found in admin's created Quiz",
      });
    }

    quizInAdmin.isResultPublished = true;
    await admin.save();

    const resultData = {
      quiz: quizId,
      users: [],
    };

    await Promise.all(
      userIds.map(async (userData) => {
        const { userId, isAllowedToViewResult } = userData;

        if (!isAllowedToViewResult) {
          return;
        }
        const user = await User.findById(userId);
        if (!user) {
          console.warn(`User with ID ${userId} not found`);
          return;
        }

        // Fetch user's attempted quiz for the specified quizId
        const attemptedQuiz = user.attemptedQuizes.find(
          (attemptedQuiz) => attemptedQuiz.quiz.toString() === quizId
        );

        if (attemptedQuiz) {
          // Update the result data with user's score and time taken
          resultData.users.push({
            userId: new mongoose.Types.ObjectId(userId),
            score: attemptedQuiz.score,
            TimeTaken: attemptedQuiz.TimeTaken,
          });
        } else {
          console.warn(`User with ID ${userId} has not attempted the quiz`);
        }
      })
    );

    const result = new Result(resultData);
    await result.save();

    quizInAdmin.allowedUsers = resultData.users.map((user) => user.userId);

    await admin.save();
    return res.json({ status: 201, message: "Result published successfully" });
  } catch (error) {
    console.log("Some Error Occured during publishing the result", error);
  }
};

const adminUserHistory = async (req, res) => {
  try {
    const { quizId } = req.body;

    const users = await User.find({ "attemptedQuizes.quiz": quizId });

    // console.log(users);
    const results = users
      .map((user) => {
        const attemptedQuiz = user.attemptedQuizes.find(
          (quiz) => quiz.quiz.toString() === quizId
        );
        // console.log(attemptedQuiz);

        if (attemptedQuiz) {
          const { TimeTaken, score } = attemptedQuiz;
          return { userId: user._id, name: user.name, TimeTaken, score };
        }
        return null;
      })
      .filter((result) => result !== null);
    // console.log(results)
    res.json({ status: 201, result: results });
  } catch (error) {
    console.log("Some error occured during getting adminUserHistory", error);
  }
};

const checkResultPublished = async (req, res) => {
  try {
    const { adminId, quizId } = req.body;

    // Check if the admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.json({ status: 404, message: "Admin not found" });
    }

    // Check if the specified quiz exists in the admin's created quizzes
    const quiz = admin.createdQuizes.find(
      (createdQuiz) => createdQuiz._id.toString() === quizId
    );

    if (!quiz) {
      return res.json({ status: 404, message: "Quiz not found for the admin" });
    }

    // Check if the result is published
    const isResultPublished = quiz.isResultPublished;

    return res.json({ status: 200, isresultPublished: isResultPublished });
  } catch (error) {
    console.log("Some error occured while checking result published", error);
  }
};

const getLeaderBoard = async (req, res) => {
  try {
    const { quizId } = req.body;

    // Check if the quiz exists
    const quizExists = await Result.findOne({ quiz: quizId });
    if (!quizExists) {
      return res.json({ status: 404, message: 'Quiz not found in results' });
    }

    // Fetch results for the specific quiz
    const results = await Result.findOne({ quiz: quizId }).populate('users.userId');
    if (!results) {
      return res.json({ status: 404, message: 'No results found for the quiz' });
    }

    console.log(results)
    // Prepare leaderboard data
    const leaderboard = results.users
      .sort((a, b) => b.score - a.score);
    return res.json({ status: 201, leaderboard })
  } catch (error) {
    console.log('Some Error Occured during getting the leaderBoard', error)
  }
}


module.exports = {
  addAdmin,
  getAdmin,
  publishResult,
  adminUserHistory,
  getLeaderBoard,
  checkResultPublished
};