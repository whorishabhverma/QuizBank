import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserQuizContext from "../../Context/UserQuizContext";
import axios from "axios";

const Instruction = () => {
  const navigate = useNavigate();
  const [proceedClicked, setProceedClicked] = useState(false);

  const location = useLocation();
  const { detail } = location.state || {};

  const quiz = detail.quiz;
  console.log("vbn");
  console.log(quiz);

  const handleProceedClick = () => {
    const newDetail = detail;
    navigate("/quiz", { state: { newDetail } });
  };

  return (
    <>
      <div
        className="instructcontainer"
        style={{
          background: "linear-gradient(rgba(0,0,50,0.7),rgba(0,0,50,0.7))",
          color: "#fff",
          minHeight: "89vh",
        }}
      >
        <h3
          style={{
            color: "cyan",
            display: "flex",
            justifyContent: "center",
            marginTop: "2%",
          }}
        >
          Title : {quiz.name}
        </h3>
        <p
          style={{
            color: "cyan",
            display: "flex",
            justifyContent: "center",
            marginTop: "2px",
          }}
        >
          Discription : {quiz.description}
        </p>
        <p
          style={{
            color: "cyan",
            display: "flex",
            justifyContent: "center",
            marginTop: "2px",
          }}
        >
          Time : {quiz.duration} Minutes
        </p>
        <hr className="white-line" />
        <h1
          style={{
            color: "cyan",
            display: "flex",
            justifyContent: "center",
            marginTop: "2%",
          }}
        >
          Quiz Instructions
        </h1>
        <div
          className="instruction-lines"
          style={{ textAlign: "center", marginTop: "0px" }}
        >
          <p>
            Welcome to the Quiz App! Please read the following instructions
            carefully before starting the quiz.
          </p>

          <ul
            className="mt-3"
            style={{ listStylePosition: "inside" }}
          >
             <li className="">
          <strong className="font-weight-extra-bold text-decoration-underline">
            You are not permitted to switch tabs during the quiz, attempting to do so will automatically submit your quiz.
          </strong>
        </li>
            <li>There will be a series of questions.</li>
            <li>Choose the correct answer for each question.</li>
            <li>There is a timer for this quiz.</li>
            <li>
              Use the "Prev" and "Next" buttons to move between questions.
            </li>
            <li>You can undo your selection by clicking the "Undo" button.</li>
            <li>There is no negative marking.</li>
            <li>
              Click the "Proceed" button when you are ready to start the quiz.
            </li>
          </ul>
        </div>
        <div className="quiz-detail-user">
          <div>{}</div>
        </div>
        {proceedClicked ? (
          <p>Proceed button clicked! Add your custom content or logic here.</p>
        ) : (
          <div
            className="proceed"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "3%",
            }}
          >
            <button
              style={{ backgroundColor: "#8472c4" }}
              onClick={handleProceedClick}
            >
              Proceed to Quiz
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Instruction;
