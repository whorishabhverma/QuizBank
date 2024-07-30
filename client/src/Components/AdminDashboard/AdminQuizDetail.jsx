import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../Styles/AdminQuizDetail.css";
import Login from "../LoginSignup/Login";
import axios from "axios";

const AdminQuizDetail = () => {

  const location = useLocation();
  const { detail } = location.state || {};
  const [isResultPublished, setisResultPublished] = useState(false);
  const [isChecked, setIsChecked] = useState(
    detail.quiz.attemptedBy.map(() => true)
  );
  const [userHistory, setUserHistroy] = useState([]);
  const [isclicked, setIsclicked] = useState(false);
  const userIds = [];
  useEffect(() => {
    getHistory();
  }, [])
  const handleCheckboxChange = (index) => {
    const newCheckedState = [...isChecked];
    newCheckedState[index] = !newCheckedState[index];
    setIsChecked(newCheckedState);
  };

  const getHistory = async () => {
    try {
      const response = await axios.post("http://localhost:8000/admin-user-history", {
        quizId: detail.quiz._id
      })
      if (response) {
        setUserHistroy(response.data.result);
        console.log(response.data.result);
      }
      try {
        const response = await axios.post('http://localhost:8000/check-result-published', {
          adminId: detail.adminId,
          quizId: detail.quiz._id
        })
        if (response) {
          setisResultPublished(response.data.isresultPublished)
        }
      } catch (error) {
        console.log('Some error occured while checking result published', error);
      }
    } catch (error) {
      console.log('Some error occured during getting history', error)
    }
  }

  const publishResult = async () => {
    detail.quiz.attemptedBy.map((user, i) => userIds.push({ userId: user._id, isAllowedToViewResult: isChecked[i] }))
    // console.log(userIds)
    try {
      const response = await axios.post('http://localhost:8000/publish-result', {
        adminId: detail.adminId,
        userIds: userIds,
        quizId: detail.quiz._id
      })
      if (response) {
        console.log('Response', response)
        setIsclicked(true);
        window.alert('Quiz Result published successfully');
      }
    } catch (error) {
      console.log('Some Error occured during publishing result', error)
    }
  };

  const calculateScore = async () => {
    try {
      const response = await axios.post('http://localhost:8000/calculate-score', {
        quizId: detail.quiz._id
      })
      if (response) {
        window.alert('Score calculated successfully');
      }
    } catch (error) {
      console.log('Some Error occured during calculating score', error);
    }
  }
  return (
    <div>
      {detail !== undefined ? (
        <div className="main-detail" style={{ background: "linear-gradient(rgba(0,0,50,0.7),rgba(0,0,50,0.7))", color: "#fff", minHeight: "89vh" }}>
          <div className="home-bannerImage-container">
          </div>
          <div className="quiz-detail">
            <div className="details">
              <div>
                <div className="quiz-name">Quiz Name : {detail.quiz.name}</div>
                <div className="quiz-name">
                  {" "}
                  Quiz Description : {detail.quiz.description}
                </div>
              </div>
              <div>
                <div className="quiz-name">
                  {" "}
                  Quiz Start Time : {detail.quiz.startTime.split("T")[0]}
                </div>
                <div className="quiz-name">
                  Quiz End Time : {detail.quiz.endTime.split("T")[0]}
                </div>
              </div>
              <div>
                <div className="quiz-name">
                  Date :{detail.quiz.dateCreated.split("T")[0]}
                </div>
                <div className="quiz-name">
                  Total Time of Quiz={detail.quiz.duration} mins
                </div>
              </div>
            </div>
            <div className="quest-detail">
              {detail.quiz.questions.map((ques, i) => (
                <div className="questions-detail" key={i}>
                  <div className="ques-text">
                    <div>
                      {i + 1}. {ques.questionText}
                    </div>
                    <div>Marks: {ques.marks}</div>
                  </div>
                  <div className="ques-options">
                    {ques.options.map((op, j) => (
                      <div className="option-text" key={j}>
                        <input type="radio" disabled />
                        <div className="op-txt">{op}</div>
                      </div>
                    ))}
                  </div>
                  <div className="correct-ans">
                    {ques.questionType !== "short-answer" ? (
                      <div>Correct-Answer: {ques.correctAnswer}</div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="user-detail-attempted">
            <p>User Attempted Quiz</p>
            <table
              className="table table-striped table-hover"
              id="table-history"
            >
              <thead>
                <tr>
                  <th scope="col">S. No.</th>
                  <th scope="col">User-Name</th>

                  <th scope="col">Time-taken</th>
                  <th scope="col">Score</th>
                  <th scope="col">Manage</th>
                </tr>
              </thead>

              <tbody>
                {userHistory.length !== 0 ? (
                  userHistory.map((usr, ij) => (
                    <tr key={ij}>
                      <th scope="row">{ij + 1}</th>
                      <td>{usr.name}</td>

                      <td>{usr.TimeTaken} mins</td>
                      <td>{usr.score}</td>
                      <input
                        type="checkbox"
                        checked={isChecked[ij]}
                        onChange={() => handleCheckboxChange(ij)}
                      />
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No user attempted till now</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="publish-quiz">
            <button className="btn btn-primary1" style={{ color: "cyan" }} onClick={calculateScore}>
              Calculate Score
            </button>
            {isResultPublished && isclicked ? (<button className="btn btn-primary1" disabled>Result Published</button>) : (<button className="btn btn-primary1" style={{ color: "cyan" }} onClick={publishResult}>
              Publish Result
            </button>)}

          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default AdminQuizDetail;
