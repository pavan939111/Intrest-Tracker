// 📁 components/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [today, setToday] = useState("");

  useEffect(() => {
    const date = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    setToday(date);
  }, []);

  return (
    <div className="dashboard-wrapper">
      {user && (
        <div className="userdetails">
          <h2 className="user-welcome">👋 Welcome, {user.fullName}</h2>
          <p>📅 Today is <strong>{today}</strong></p>
        </div>
      )}

      <div className="dashboard-container">
        <div className="dashboard-card">
          <h1 className="dashboard-title">📊 Interest Tracker</h1>
          <p className="dashboard-quote">"Track your money smartly — lend or borrow with clarity."</p>

          {user ? (
            <div className="dashboard-buttons">
              <button onClick={() => navigate("/payer")} className="btn btn-payer">
                I want to Pay Interest
              </button>
              <button onClick={() => navigate("/giver")} className="btn btn-giver">
                I want to Receive Interest
              </button>
              <button onClick={() => navigate("/calculator")} className="btn btn-calc">
                Interest Calculator
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="btn">Login</button>
              <button onClick={() => navigate("/register")} className="btn">Register</button>
            </>
          )}

          <p className="dashboard-tip">Tip: Keep your interest records updated regularly.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
