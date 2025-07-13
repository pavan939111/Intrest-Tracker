import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../css/giver.css";

const calculateDuration = (startDate) => {
  const start = new Date(startDate);
  const today = new Date();
  const diffTime = today - start;
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  return { months, days };
};

const calculateInterest = (amount, rate, startDate) => {
  const { days } = calculateDuration(startDate);
  const interest = (amount * (rate / 100) * days) / 365;
  return interest.toFixed(2);
};

const GiverView = () => {
  const [form, setForm] = useState({
    borrowerName: "",
    amount: "",
    rate: "",
    startDate: "",
  });

  const [entries, setEntries] = useState([]);
  const [history, setHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const entryId = uuidv4();
      const res = await axios.post("https://intrest-tracker.onrender.com/api/giver", {
        ...form,
        userId: user._id,
        entryId,
      });
      setEntries([...entries, res.data]);
      setForm({ borrowerName: "", amount: "", rate: "", startDate: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Failed to save entry:", err.response?.data?.message);
    }
  };

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`https://intrest-tracker.onrender.com/api/giver/${user._id}`);
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch entries:", err.response?.data?.message);
    }
  };

  const toggleHistory = async () => {
    if (showHistory) {
      setShowHistory(false);
    } else {
      try {
        const res = await axios.get(`https://intrest-tracker.onrender.com/api/giver/history/${user._id}`);
        setHistory(res.data);
        setShowHistory(true);
      } catch (err) {
        console.error("❌ Failed to fetch history:", err.message);
      }
    }
  };

  const handleUpdate = (entry) => {
    navigate(`/update/${entry.entryId}`);
  };

  useEffect(() => {
    if (user) fetchEntries();
  }, []);

  return (
    <div className="giver-container">
      <div className="giver-header">
        <h2 className="giver-heading">📘 Lending Transactions</h2>
        <button className="go-back-btn" onClick={() => navigate(-1)}>⬅️ Go Back</button>
      </div>

      <div className="giver-top-buttons">
        <button className="show-form-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "➕ Add Borrower"}
        </button>
        <button className="history-btn" onClick={toggleHistory}>
          {showHistory ? "⬆️ Hide History" : "📜 View History"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="giver-form">
          <input type="text" name="borrowerName" placeholder="Borrower Name" value={form.borrowerName} onChange={handleChange} required />
          <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
          <input type="number" name="rate" placeholder="Interest Rate (%)" value={form.rate} onChange={handleChange} required />
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
          <button type="submit">✅ Submit</button>
        </form>
      )}

      <div className="giver-list">
        <h3>📋 Your Active Entries</h3>
        {entries.length > 0 ? (
          entries.map((entry) => {
            const { months, days } = calculateDuration(entry.startDate);
            const interest = calculateInterest(entry.amount, entry.rate, entry.startDate);
            return (
              <div className="giver-entry" key={entry.entryId}>
                <p><strong>{entry.borrowerName}</strong></p>
                <p>₹{entry.amount} at {entry.rate}%</p>
                <p>Duration: {months} months, {days} days</p>
                <p>Interest Till Today: ₹{interest}</p>
                <button className="update-btn" onClick={() => handleUpdate(entry)}>🔄 Update</button>
              </div>
            );
          })
        ) : (
          <p>No active lending records yet.</p>
        )}
      </div>

      {showHistory && (
        <div className="history-list">
          <h3>🕘 Cleared Lending History</h3>
          {history.length > 0 ? (
            history.map((entry) => (
              <div className="giver-entry" key={entry.entryId}>
                <p><strong>{entry.borrowerName}</strong></p>
                <p>₹{entry.amount} at {entry.rate}%</p>
                <p>Cleared on: {new Date(entry.clearedAt).toLocaleDateString("en-IN")}</p>
                <p>Total Interest Paid: ₹{entry.totalInterest}</p>
                <p>Total Amount Received: ₹{entry.totalAmountPaid}</p>
              </div>
            ))
          ) : (
            <p>No records found in history.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GiverView;
