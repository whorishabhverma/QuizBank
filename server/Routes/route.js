const express = require('express');
const router = express.Router();
const { addUser, getUser, getResult, getUserHistory, saveUserResponse } = require('../Controllers/userController.js');
const { addAdmin, getAdmin, publishResult, adminUserHistory, checkResultPublished, getLeaderBoard} = require('../Controllers/adminController.js');
const { getQuiz, addQuiz, calculateScores, deleteQuiz, getQuizzes } = require('../Controllers/quizController.js');

router.get('/', (req, res) => {
    res.send("Hello from route");
});


router.post('/register-user',addUser);
router.post('/register-admin',addAdmin);
router.post('/login-user', getUser);
router.post('/login-admin', getAdmin);
router.post('/add-quiz', addQuiz)
router.post('/get-quiz', getQuiz);
router.post('/get-quizzes',getQuizzes);
router.post('/delete-quiz', deleteQuiz);
router.post('/save-quiz', saveUserResponse);
router.post('/calculate-score', calculateScores);
router.post('/publish-result', publishResult);
router.post('/admin-user-history', adminUserHistory);
router.post('/check-result-published', checkResultPublished);
router.post('/get-userHistory', getUserHistory);
router.post('/get-result', getResult);
router.post('/get-leaderboard', getLeaderBoard);

module.exports = router;
