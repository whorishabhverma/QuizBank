import React from "react";
import Cartoon from "../../Assets/Cartoon.png";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="HomePage">
      <Navbar />
      <div >
        <div >
        </div>
        <div >
          <div className="welcome-photo">
            <div className="welcome-line">
              <h1>
                Welcome To QuizNest!
              </h1>
            </div>
            <div className="cartoon-container">
              <img src={Cartoon} alt="" />
            </div>
          </div>

          <button className="d-flex mx-auto btn btn-primary start-button" onClick={() => { navigate('/register') }}>
            Start here{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;