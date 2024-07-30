import React, { useState, useEffecct, useEffect } from 'react'
import "../../Styles/Result.css";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Result = () => {
  const [quizData, setQuizData] = useState([]);
  const location = useLocation();
  const { send } = location.state || {};
  const navigate = useNavigate();
  useEffect(() => {
    getResult();
  }, []);

  const getResult = async () => {
    try {
      const response = await axios.post("http://localhost:8000/get-result", {
        userId: send.userId,
        quizId: send.quizId,
      });
      if (response) {
        console.log(response);
        setQuizData(response.data.quizDetails);
        console.log(quizData);
      }
    } catch (error) {
      console.log("Some Error Occured while getting result", error);
    }
  };
  if (!quizData) {
    return <div>Loading...</div>;
  }



  const getLeaderBoard = () => {
    const quiz = { quizId: send.quizId };
    navigate('/leaderboard', { state: { quiz } });
  }
  return (
    <div style={{ background: "linear-gradient(rgba(0,0,50,0.7),rgba(0,0,50,0.7))", color: "#fff", minHeight: "89vh" }}>
      <div className="Result-container" style={{ backgroundColor: "#8472c4", border: "2px solid #8472c4" }}>
        <h1 style={{ color: "#fff" }}>Quiz Result</h1>
        <div className="show-quest">
          {quizData.map.length !== 0 ? (
            quizData.map((Question, index) => (
              <div className="question-sec" key={index}>
                {index + 1}. {Question.question}
                <div className="options-multiple">
                  {Question.options.map((op, jk) => (
                    <div key={jk}><input type="radio" disabled />{op}</div>
                  ))}
                </div>
                <div style={{ color: "cyan" }}>Correct Answer: {Question.correctAnswer}</div>
                <div>Marked Answer: {Question.userSelectedOption}</div>
              </div>
            ))
          ) : (
            <div>Nothing to show</div>
          )}
        </div>

      </div>
      <button style={{ backgroundColor: "#8472c4", color: "#fff" }} onClick={getLeaderBoard}>LeaderBoard</button>
    </div>
  );
};

export default Result;
