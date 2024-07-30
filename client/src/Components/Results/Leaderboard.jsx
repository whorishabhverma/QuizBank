import React, { useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom';
import "../../Styles/LeaderBoard.css";
import axios from 'axios';

const LeaderBoard = () => {
  const location = useLocation();
  const { quiz } = location.state || {};
  console.log('Quiz', quiz);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    getLeaderBoard();
  }, []);

  const getLeaderBoard = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/get-leaderboard",
        {
          quizId: quiz.quizId,
        }
      );
      if (response) {
        setLeaderboardData(response.data.leaderboard);
        console.log(response.data.Leaderboard);
      }
    } catch (error) {
      console.log("Somne Erro Occured during getting leaderboard", error);
    }
  };

  return (
    <div style={{ background: "linear-gradient(rgba(0,0,50,0.7),rgba(0,0,50,0.7))", color: "#fff", minHeight: "89vh" }} >
      <h2 className="leader-h2" style={{ color: "#fff" }}>LeaderBoard </h2>
      {quiz ? (
        <div>
          <div className="home-bannerImage-container">
          </div>
          <table className="leader-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>User Name</th>
                <th>Score</th>
                <th>Total Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.userId.name}</td>
                  <td>{entry.score}</td>
                  <td>{entry.TimeTaken}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No data Available</div>
      )}
    </div>
  );
};

export default LeaderBoard;