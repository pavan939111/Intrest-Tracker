import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/payer.css";

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

const PayerView = () => {
  const [form, setForm] = useState({
    lenderName: "",
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
      const res = await axios.post("https://intrest-tracker.onrender.com/api/payer", {
        ...form,
        userId: user._id,
      });
      setEntries([...entries, res.data]);
      setForm({ lenderName: "", amount: "", rate: "", startDate: "" });
      setShowForm(false);
    } catch (err) {
      console.error("❌ Error saving entry:", err.message);
    }
  };

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`https://intrest-tracker.onrender.com/api/payer/${user._id}`);
      setEntries(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch entries:", err.message);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`https://intrest-tracker.onrender.com/api/payer/history/${user._id}`);
      setHistory(res.data);
      setShowHistory(!showHistory);
    } catch (err) {
      console.error("❌ Failed to fetch history:", err.message);
    }
  };

  const handleUpdate = (entry) => {
    if (!entry._id) return;
    navigate(`/updatePayer/${entry._id}`);
  };

  useEffect(() => {
    if (user) fetchEntries();
  }, []);

  return (
    <div className="payer-container">
      {/* ✅ Header with Go Back */}
      <div className="payer-header">
        <h2 className="payer-heading">💰 Borrowing Transactions</h2>
        <button className="go-back-btn" onClick={() => navigate(-1)}>
          ⬅️ Go Back
        </button>
      </div>

      <div className="payer-top-buttons">
        <button className="show-form-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "➕ Add Lender"}
        </button>
        <button className="history-btn" onClick={fetchHistory}>
          {showHistory ? "⬆️ Hide History" : "📜 View History"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="payer-form">
          <input
            type="text"
            name="lenderName"
            placeholder="Lender Name"
            value={form.lenderName}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="rate"
            placeholder="Interest Rate (%)"
            value={form.rate}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
          <button type="submit">✅ Submit</button>
        </form>
      )}

      <div className="payer-list">
        <h3>📋 Your Active Borrowings</h3>
        {entries.length > 0 ? (
          entries.map((entry) => {
            const { months, days } = calculateDuration(entry.startDate);
            const interest = calculateInterest(entry.amount, entry.rate, entry.startDate);
            return (
              <div className="payer-entry" key={entry._id}>
                <p><strong>{entry.lenderName}</strong></p>
                <p>₹{entry.amount} at {entry.rate}%</p>
                <p>Duration: {months} months, {days} days</p>
                <p>Interest Till Today: ₹{interest}</p>
                <button className="update-btn" onClick={() => handleUpdate(entry)}>🔄 Update</button>
              </div>
            );
          })
        ) : (
          <p>No active borrowings found.</p>
        )}
      </div>

      {showHistory && (
        <div className="history-list">
          <h3>🕘 Cleared Borrowing History</h3>
          {history.length > 0 ? (
            history.map((entry) => (
              <div className="payer-entry" key={entry._id}>
                <p><strong>{entry.lenderName}</strong></p>
                <p>₹{entry.amount} at {entry.rate}%</p>
                <p>Cleared on: {new Date(entry.clearedAt).toLocaleDateString("en-IN")}</p>
                <p>Total Interest Paid: ₹{entry.totalInterest}</p>
                <p>Total Amount Paid: ₹{entry.totalAmountPaid}</p>
              </div>
            ))
          ) : (
            <p>No cleared records found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PayerView;
