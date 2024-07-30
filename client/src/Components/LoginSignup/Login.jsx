import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import "../../Styles/LoginSignup.css";
import axios from "axios";
import LoginContext from "../../Context/LoginContext";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("user");
  const [isError, setisError] = useState(false);
  const [error, setError] = useState("Some Error Occured!");

  const [flag, setFlag] = useState(false);

  const navigate = useNavigate();

  const { loginId, setloginId } = useContext(LoginContext);

  useEffect(() => {
    console.log(loginId)
    if (loginId) navigate('/admin')
  }, [loginId, flag])

  useEffect(() => {
    console.log('hey')
    if (flag) {
      navigate('/admin');
    }
  }, [flag]);

  const check = async (e) => {
    e.preventDefault();
    if (role === "user") {
      // User login logic
      try {
        const response = await axios.post("http://localhost:8000/login-user", {
          email: email,
          password: pass,
        });
        if (!response) {
          setisError(true);
          setError("Something went wrong");
          return;
        } else {
          setisError(false);
        }
        if (response.data.message === "User does not exist") {
          setisError(true);
          setError(response.data.message);
          return;
        } else if (response.data.message === "Invalid Password") {
          setisError(true);
          setError("Invalid email or Password");
          return;
        }
        setloginId({
          userId: response.data.userInfo._id,
          userName: response.data.userInfo.name,
          userEmail: response.data.userInfo.email,
          quizIds: response.data.userInfo.attemptedQuizes,
        });
        navigate('/user');
        window.alert("User Login successfully");
      } catch (error) {
        setisError(true);
        setError("An error occurred during login");
      }
    } else {
      // Admin login logic
      try {
        const response = await axios.post("http://localhost:8000/login-admin", {
          email: email,
          password: pass,
        });
        if (!response) {
          setisError(true);
          setError("Something went wrong");
          return;
        } else {
          setisError(false);
        }
        if (response.data.message === "Admin does not exist") {
          setError(response.data.message);
          setisError(true);
          return;
        } else if (response.data.message === "Invalid Password") {
          setisError(true);
          setError("Invalid email or Password");
          return;
        }

        const userData = {
          adminId: response.data.adminId,
          adminName: response.data.adminName,
          adminEmail: response.data.adminEmail,
          quizIds: response.data.quizIds,
        };

        setloginId(userData); // Update loginId in context
        sessionStorage.setItem('loginId', JSON.stringify(userData)); // Store login data in sessionStorage
        navigate('/admin'); // Redirect to admin dashboard
        window.alert("Admin Login successfully");
      } catch (error) {
        setisError(true);
        setError("An error occurred during login");
      }
    }
  };


  return (
    <div className="Login-main">
      <div className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6 col-sm-7">
            <div className="card p-3" style={{ backgroundColor: "#f8f9fa" }}>
              <h2 className="text-center mb-4">Login</h2>
              <form onSubmit={check}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="youremail@gmail.com"
                    name="email"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="********"
                    name="password"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="mb-3 text-center">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>
                {isError && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
              </form>
              <div className="text-center">
                <Link to={"/register"} className="text-decoration-none">
                  Don't have an account? Register Here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
