import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/logo.png"
import "../../Styles/Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLocation, NavLink } from "react-router-dom";
import LoginContext from "../../Context/LoginContext"



function NavBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  console.log(currentPath);
  const navigate = useNavigate();
  const { loginId, setloginId } = useContext(LoginContext);

  // Custom - CSS
  const shadowDark = {
    height: "10vh",
    boxShadow: "0 0.5px 4px rgba(0, 0, 0, 0.5)",
  };

  const navLinkStyle = {
    fontSize: "18px",
    fontWeight: "normal",
    color: "#333", // Darker color
    marginRight: "20px", // Margin between the links
    textDecoration: "none", // Remove underline
    transition: "color 0.3s ease", // Smooth color transition on hover
  };

  const hoverStyle = {
    color: "blue", // Change color to blue on hover
    textDecoration: "underline", // Add underline on hover
  };

  // Function to handle hover effect
  const handleHover = (e) => {
    e.target.style.color = hoverStyle.color;
    e.target.style.textDecoration = hoverStyle.textDecoration;
  };

  // Function to handle mouse leave
  const handleMouseLeave = (e) => {
    e.target.style.color = navLinkStyle.color;
    e.target.style.textDecoration = navLinkStyle.textDecoration;
  };

  const handleLogout = () => {
    // Remove details from session storage
    sessionStorage.removeItem('loginId');
    setloginId(null);
    navigate("/login");


    // Log to console for debugging
    console.log("Logged out and navigated to login page");
  };

  return (
    <>
      <div>
        <Navbar bg="light" expand="lg" fixed="top" style={shadowDark}>
          <Navbar.Brand
            style={{ marginLeft: "40px", fontSize: "30px" }}
          >
            <div className="navbar-logo">
              <img src={logo} alt="" />
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="mx-auto">
              <NavLink
                to="/"
                style={navLinkStyle}
                onMouseEnter={handleHover}
                onMouseLeave={handleMouseLeave}
              >
                Home
              </NavLink>
              <NavLink
                to="/"
                style={navLinkStyle}
                onMouseEnter={handleHover}
                onMouseLeave={handleMouseLeave}
              >
                Quiz
              </NavLink>
              <NavLink
                to="#"
                style={navLinkStyle}
                onMouseEnter={handleHover}
                onMouseLeave={handleMouseLeave}
              >
                Scores
              </NavLink>
            </Nav>

            <div>
              {currentPath === "/" ||
                currentPath === "/login" ||
                currentPath === "/register" ? (
                <div className="d-lg-block me-4" style={{ position: "relative" }}>
                  <Button
                    variant="outline-primary"
                    className="mr-2"
                    style={{ marginRight: "10px", color: "#fff" }}
                  >
                    <Link
                      to="/login"
                      style={{ textDecoration: "none", margin: "8px" }}
                    >
                      Login
                    </Link>
                  </Button>
                  <Button
                    variant="outline-primary"
                    style={{ marginRight: "20px" }}
                  >
                    <Link
                      to="/register"
                      style={{ textDecoration: "none", margin: "8px" }}
                    >
                      Register
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="d-lg-block me-4" style={{ position: "relative" }}>
                  <Button
                    variant="outline-primary"
                    className="mr-2"
                    style={{ marginRight: "10px" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <div style={{ paddingTop: "65px" }}></div>
    </>
  );
}

export default NavBar;