import React, { useContext, useEffect, useState } from "react";
import "../../Styles/Forms.css";
import CropOriginal from "@mui/icons-material/CropOriginal";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuizContext from "../../Context/QuizContext";

// this component for save question in quiz 

const Forms = () => {
  const [questions, setQuestions] = useState([
    {
      questionText: "Question ?",
      questionType: "multiple-choice",
      options: [
        { optionText: "Option 1" },
        { optionText: "Option 2" },
        { optionText: "Option 3" },
        { optionText: "Option 4" },
      ],
      answer: false,
      answerKey: "",
      points: 0,
    },
  ]);

  const { setForm } = useContext(QuizContext);
  useEffect(() => {
    setForm({ questions })
  }, [questions, setQuestions]);

  function changeQuestion(text, i) {
    var newQuestion = [...questions];
    newQuestion[i].questionText = text;
    setQuestions(newQuestion);
    console.log(newQuestion);
  }

  function addQuestionType(type, i) {
    var newQuestion = [...questions];
    newQuestion[i].questionType = type;
    setQuestions(newQuestion);
    console.log(newQuestion);
  }

  function changeOptionValue(text, i, j) {
    var newQuestion = [...questions];
    newQuestion[i].options[j].optionText = text;
    setQuestions(newQuestion);
    console.log(newQuestion);
  }

  function removeOption(i, j) {
    var RemoveOptionQuestion = [...questions];
    if (RemoveOptionQuestion[i].options.length > 1) {
      RemoveOptionQuestion[i].options.splice(j, 1);
      setQuestions(RemoveOptionQuestion);
    }
  }

  function addOption(i) {
    var newQuestion = [...questions];

    if (newQuestion[i].questionType === 'short-answer') {
      // Remove an option for short-answer type
      newQuestion[i].options.splice(0, 1);
    } else if (newQuestion[i].questionType === 'true-false') {
      // Ensure only two options for true-false type
      newQuestion[i].options = [
        { optionText: 'True' },
        { optionText: 'False' },
      ];
    } else {
      // Add a new option if the total options are less than 5 for other types
      if (newQuestion[i].options.length < 5) {
        newQuestion[i].options.push({
          optionText: 'Option ' + (newQuestion[i].options.length + 1),
        });
      }
    }

    setQuestions(newQuestion);
    console.log(newQuestion);
  }


  function addMoreQuestions(i) {
    var newQuestion = [...questions];
    newQuestion.splice(i + 1, 0, {
      questionText: "New Question",
      questionType: "multiple-choice",
      options: [
        { optionText: "Option 1" }
      ],
      answer: false,
      answerKey: "",
      points: 0,
    });
    setQuestions(newQuestion);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth', // Optional: Adds a smooth scrolling effect
    });
  }

  function deleteQuestions(i) {
    var newQuestion = [...questions];
    if (questions.length > 1) {
      newQuestion.splice(i, 1);
    }
    setQuestions(newQuestion);
  }

  function addAnswer(i) {
    var answerofQuestion = [...questions];
    answerofQuestion[i].answer = !answerofQuestion[i].answer;
    setQuestions(answerofQuestion);
  }

  function doneAnswer(i) {
    var answerofQuestion = [...questions];
    answerofQuestion[i].answer = !answerofQuestion[i].answer;
    setQuestions(answerofQuestion);
  }

  function setOptionPoints(points, i) {
    var Questions = [...questions];
    Questions[i].points = points;
    setQuestions(Questions);
    console.log(i + " " + points);
  }

  function setOptionAnswer(ans, i) {
    var Questions = [...questions];
    Questions[i].answerKey = ans;
    setQuestions(Questions);
    console.log(i + ' ' + ans);
  }

  return (
    <div className="form-main" style={{ marginTop: "-10px" }}>
      <div className="question-boxes">
        {questions.map((ques, i) => (
          <div key={i}>
            {!questions[i].answer ? (
              <div className="questions">
                <div className="add-question-top">
                  <p className="text-white" >{i + 1}.</p>
                  <input
                    type="text"
                    value={ques.questionText}
                    className="questiontext"
                    placeholder="Question"
                    onChange={(e) => changeQuestion(e.target.value, i)}
                  />
                  <select
                    className="select"
                    style={{ color: "#5f6368", fontSize: "16px" }}
                    onChange={(e) => addQuestionType(e.target.value, i)}
                  >
                    <option value="multiple-choice">Multiple-Choice</option>
                    <option value="true-false">True-False</option>
                  </select>
                </div>

                {ques.options.map((op, j) => (
                  <div className="add-question-body" key={j}>
                    <div>
                      {/* only for symbol */}
                      {questions[i].questionType === 'multiple-choice' || questions[i].questionType === 'true-false' ?
                        <input
                          type='radio'
                          disabled
                          className="disabled-inp"
                        /> : ""}
                      <input
                        type="text"
                        className="option-input"
                        value={ques.options[j].optionText}
                        placeholder="Option"
                        onChange={(e) =>
                          changeOptionValue(e.target.value, i, j)
                        }
                      />
                    </div>
                    <IconButton aria-label="delete">
                      <CloseIcon
                        onClick={() => {
                          removeOption(i, j);
                        }}
                      />
                    </IconButton>
                  </div>
                ))}

                {ques.options.length < 4 ? (
                  <div
                    className="add-question-body"
                    style={{
                      justifyContent: "flex-start",
                      marginLeft: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div>
                      <input
                        type="checkbox"
                        disabled
                        className="disabled-inp"
                      />
                    </div>
                    <button
                      className="add-option"
                      onClick={() => {
                        addOption(i);
                      }}
                    >
                      Add Option
                    </button>
                  </div>
                ) : (
                  ""
                )}

                <div className="add-footer">
                  <div className="add-question-left">
                    <button
                      className="question-btn"
                      onClick={() => {
                        addAnswer(i);
                      }}
                    >
                      <OpenInNewIcon />
                      Answer Key
                    </button>
                  </div>
                  <div className="add-question-right">
                    <button
                      className="question-btn"
                      onClick={() => {
                        addMoreQuestions(i);
                      }}
                    >
                      <AddCircleOutlineIcon />
                    </button>
                    <button
                      className="question-btn"
                      onClick={() => {
                        deleteQuestions(i);
                      }}
                      style={{ marginLeft: "5px" }}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="questions" style={{ width: "674px", marginLeft: "46px" }}>
                <div className="top-header" style={{ padding: "10px" }}>
                  Choose Correct Answer
                </div>
                <div className="add-question-top">
                  <input
                    type="text"
                    value={questions[i].questionText}
                    className="questiontext"
                    placeholder="Question"

                    disabled
                  />

                  <input
                    type="number"
                    value={questions[i].points}
                    className="questiontext"
                    placeholder="Score"
                    min="0" step="1"
                    style={{ marginLeft: "30px" }}
                    onChange={(e) => { setOptionPoints(e.target.value, i) }}
                  />

                </div>

                {ques.options.map((op, j) => (
                  <div className="add-question-body" key={j} style={{ justifyContent: "flex-start", marginLeft: "20px", marginBottom: "5px" }}>
                    <div>
                      <input
                        type="radio"
                        className="disabled-inp"
                        name={`ques${i}`}
                        onClick={() => { setOptionAnswer(questions[i].options[j].optionText, i) }}
                      />
                      <input
                        type="text"
                        className="option-input"
                        value={ques.options[j].optionText}
                        placeholder="Option"
                        disabled
                      />
                    </div>

                  </div>
                ))}

                <div className="add-question-bottom" style={{ margin: "20px" }}>
                  <button className="question-btn" onClick={() => { doneAnswer(i) }}>Done</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forms;
