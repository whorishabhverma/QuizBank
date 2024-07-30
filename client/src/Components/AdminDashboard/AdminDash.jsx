import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginContext from "../../Context/LoginContext";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import Login from "../LoginSignup/Login";


const AdminDash = () => {

  const [quizDetail, setQuizDetail] = useState([]);
  const navigate = useNavigate();

  const { loginId } = useContext(LoginContext);
  console.log('Login ID on page load admin:', loginId);

  useEffect(() => {
    console.log("hi"); // This logs "hi" to the console
    if (!loginId) { // Checks if loginId is not present
      navigate('/login'); // Redirects to the /login route
    }
  }, [loginId, navigate]);

  useEffect(() => {
    console.log("2")
    if (loginId && loginId.quizIds) {
      getHistory();
    }

  }, [loginId]);


  const deleteQuiz = async (i) => {
    console.log(loginId.quizIds, loginId.quizIds[i]);
    const response = await axios.post("http://localhost:8000/delete-quiz", {
      quizId: loginId.quizIds[i],
    });

    if (response) {
      window.alert("Quiz Deleted successfully");
      getHistory();
    }
  };

  const getHistory = async () => {
    try {
      const response = await axios.post("http://localhost:8000/get-quizzes", {
        quizIds: loginId.quizIds,
      });
      if (response) {
        setQuizDetail(response.data.quizzes);
        // console.log(quizDetail);
      }
    } catch (error) {
      console.log("Some Error Occured getting quiz history", error);
    }
  };

  const viewQuiz = async (i) => {
    console.log(quizDetail[i]._id)
    const response = await axios.post('http://localhost:8000/get-quiz', {
      quizId: quizDetail[i]._id
    })
    if (!response) {
      window.alert('Some Error Occured');
      return;
      // console.log(response);
    }
    const detail = {
      adminId: loginId.adminId,
      quiz: response.data.quiz,
    };
    navigate("/detail-quiz", { state: { detail } });
  };

  useEffect(() => {
    getHistory(); // Fetch quiz data every time the component updates
  }, []);
  console.log("here is the loginId: ");
  console.log(loginId);

  return (
    <div style={{ background: "linear-gradient(rgba(0,0,50,0.7),rgba(0,0,50,0.7))", color: "#fff", height: "100vh" }}>
      {(loginId !== null) ? (
        <div className="Admin-Dashboard" >
          <div className="admin-main">

            <div className="admin-info  text-center mt-2 mb-4 ">
              <h1 className="user-head">Welcome to Admin Dashboard {loginId.adminName}</h1>
            </div>

            <div className="admin-btn text-center mb-4">
              <div className="admin-btn-grp">
                <button type="button" className="btn create-new-quiz" style={{ backgroundColor: "#8472c4", color: "#fff" }} onClick={() => navigate('/custom-quiz')}>
                  Create New Quizz
                </button>
              </div>
            </div>
            <div className="admin-history">
              <h1 className="history-head mb-4">Your Previous Quizes :</h1>
              {quizDetail !== undefined ? (
                <table
                  className="table table-striped "
                  id="table-history"

                >
                  <thead  >
                    <tr>
                      <th scope="col">S. No.</th>
                      <th scope="col">Title</th>
                      <th scope="col">Date</th>
                      <th scope="col">Duration</th>
                      <th scope="col">Attempted</th>
                      <th scope="col">Manage</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      quizDetail.map((quiz, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-light"}>
                          <th scope="row">{i + 1}</th>
                          <td style={{ color: 'blue' }}>{quiz.name}</td>
                          <td>{quiz.dateCreated.split('T')[0]}</td>
                          <td>{quiz.duration} mins</td>
                          <td>{quiz.attemptedBy.length}</td>
                          <td>
                            <VisibilityIcon onClick={() => {
                              viewQuiz(i);
                            }} style={{ color: 'green' }} />
                          </td>
                          <td>
                            <DeleteIcon onClick={() => { deleteQuiz(i) }} style={{ color: 'blue' }} />
                          </td>
                        </tr>
                      ))
                    }


                  </tbody>
                </table>) : (<div>No Quiz Found</div>)}

            </div>
          </div>
        </div>
      ) : (
        navigate('/login')
      )}
    </div>
  );
};

export default AdminDash;
