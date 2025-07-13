// 📁 components/LandingPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalculator, FaMoneyBillWave } from "react-icons/fa";
import "../css/landing.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-hero">
        <h1 className="landing-title">
          <FaMoneyBillWave style={{ marginRight: "10px" }} />
          Smart Interest Tracker
        </h1>
        <p className="landing-subtitle">
          Manage your lending & borrowing with automated interest calculation.
        </p>

        <button className="landing-btn" onClick={() => navigate("/calculator")}>
          <FaCalculator style={{ marginRight: "8px" }} />
          Try Interest Calculator
        </button>

        <p className="landing-note">
          🔐{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>Login</span>{" "}
          or{" "}
          <span className="auth-link" onClick={() => navigate("/register")}>Register</span>{" "}
          to unlock full tracking features.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
