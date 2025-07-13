import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMoneyCheckAlt,
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaCalculator,
  FaTachometerAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../css/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div
          className="navbar-logo"
          onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")}
        >
          <FaMoneyCheckAlt className="logo-icon" />
          <span className="logo-text">Interest Tracker</span>
        </div>

        <div className="navbar-links">
          <Link to={isLoggedIn ? "/dashboard" : "/"} className="nav-link">
            <FaHome className="link-icon" /> Home
          </Link>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="nav-link">
                <FaSignInAlt className="link-icon" /> Login
              </Link>
              <Link to="/register" className="nav-link hide-on-mobile">
                <FaUserPlus className="link-icon" /> Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link hide-on-mobile">
                <FaTachometerAlt className="link-icon" /> Dashboard
              </Link>
              <Link to="/calculator" className="nav-link hide-on-mobile">
                <FaCalculator className="link-icon" /> Calculator
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                <FaSignOutAlt className="link-icon" /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
