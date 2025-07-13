// 📁 components/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../css/register.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "payer", // default role
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://intrest-tracker.onrender.com/api/auth/register", form);
      login(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "❌ Registration failed.");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2 className="register-title">Register</h2>

        {error && <p className="error-message">{error}</p>}

        <label className="register-label">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          className="register-input"
        />

        <label className="register-label">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="register-input"
        />

        <label className="register-label">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="register-input"
        />

        <label className="register-label">I want to:</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="register-select"
        >
          <option value="payer" className="raju">Borrow Money</option>
          <option value="receiver" className="raju">Lend Money</option>
        </select>

        <button type="submit" className="register-button">Register</button>

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login" className="link-text">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
