import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Styles/LoginSignup.css";
const Register = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [isError, setisError] = useState(false);
  const [error, setError] = useState("Some Error Occured!");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === "user") {
      setisError(false);
      if (!name || !email || !pass) {
        setError("Something is Missing!");
        setisError(true);
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:8000/register-user",
          {
            name: name,
            email: email,
            password: pass,
          }
        );
        console.log(response);
        if (!response) {
          setisError(true);
          setError("Something went wrong");
          return;
        } else {
          setError(response.data.error);
          setisError(false);
        }
        if (response.data.error === "User already Exist") {
          setError(response.data.error);
        } else if (response.data.error === "Already you registered as Admin") {
          console.log(response.data.error);
          setError(response.data.error);
        } else {
          window.alert("Registered successfully");
          navigate("/login");
        }
      } catch (error) {
        setisError(true);
      }
    } else {
      setisError(false);
      if (!name || !email || !pass) {
        setisError(true);
      }

      try {
        const response = await axios.post(
          "http://localhost:8000/register-admin",
          {
            name: name,
            email: email,
            password: pass,
          }
        );
        if (!response) {
          setisError(true);
          return;
        } else {
          setisError(false);
        }
        if (response.data.error === "Admin already Exist") {
          window.alert("Admin already Exist");
        } else {
          navigate("/login");
          window.alert("Registered successfully");
        }
      } catch (error) {
        setisError(true);
        console.log(error);
      }
    }
  };

  return (
    <div className="Login-main">
      <div className="container mb-5 ">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6 col-sm-7">
            <div className="card p-3" style={{ backgroundColor: "#f8f9fa" }}>
              <h2 className="text-center mb-4">Register</h2>
              <form onSubmit={handleSubmit} id="form-id">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Full Name"
                  />
                </div>
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
                    placeholder="Email"
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
                    placeholder="Password"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="mb-3 text-center">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                </div>
                {isError && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
              </form>
              <div className="text-center">
                <Link to={"/login"} className="text-decoration-none">
                  Already Registered? Login Here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
