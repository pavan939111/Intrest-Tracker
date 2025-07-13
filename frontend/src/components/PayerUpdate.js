import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/payerUpdate.css";

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
  return (amount * (rate / 100) * days) / 365;
};

const PayerUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [form, setForm] = useState({ amount: "", rate: "" });
  const [mode, setMode] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [interestToPay, setInterestToPay] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`https://intrest-tracker.onrender.com/api/payer/entry/${id}`)
      .then((res) => {
        setEntry(res.data);
        setForm({ amount: res.data.amount, rate: res.data.rate });
      })
      .catch(() => setError("❌ Failed to fetch entry."))
      .finally(() => setLoading(false));
  }, [id]);

  const { months, days } = entry ? calculateDuration(entry.startDate) : { months: 0, days: 0 };
  const interest = entry ? calculateInterest(entry.amount, entry.rate, entry.startDate).toFixed(2) : "0.00";
  const totalDue = entry ? (parseFloat(entry.amount) + parseFloat(interest)).toFixed(2) : "0.00";

  const handleDelete = async () => {
    try {
      await axios.delete(`https://intrest-tracker.onrender.com/api/payer/${id}`);
      navigate("/payer");
    } catch {
      setError("❌ Failed to delete entry.");
    }
  };

  const handleRewrite = async () => {
    const total = parseFloat(entry.amount) + parseFloat(interest);
    const paid = parseFloat(paidAmount);
    if (isNaN(paid) || paid < 0 || paid > total) {
      setError("❌ Invalid paid amount.");
      return;
    }
    const newAmount = (total - paid).toFixed(2);
    try {
      await axios.patch(`https://intrest-tracker.onrender.com/api/payer/${id}`, {
        rewrite: true,
        amount: newAmount,
        startDate: new Date(),
      });
      navigate("/payer");
    } catch {
      setError("❌ Rewrite failed.");
    }
  };

  const handleClearInterestOnly = async () => {
    const pay = parseFloat(interestToPay);
    if (isNaN(pay) || pay <= 0 || pay > parseFloat(interest)) {
      setError("❌ Invalid interest amount.");
      return;
    }
    try {
      await axios.patch(`https://intrest-tracker.onrender.com/api/payer/${id}`, {
        partialInterestPaid: pay,
      });
      navigate("/payer");
    } catch {
      setError("❌ Interest payment failed.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`https://intrest-tracker.onrender.com/api/payer/${id}`, {
        amount: form.amount,
        rate: form.rate,
      });
      navigate("/payer");
    } catch {
      setError("❌ Update failed.");
    }
  };

  const goBack = () => navigate(-1);

  if (loading) return <p>Loading...</p>;
  if (error && !entry) return <p className="error-message">{error}</p>;

  return (
    <div className="update-page">
      <div className="update-header">
        <h2>📋 Update Borrowing Details</h2>
        <button className="go-back-btn" onClick={goBack}>⬅️ Go Back</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <p><strong>Lender:</strong> {entry.lenderName}</p>
      <p><strong>Start Date:</strong> {new Date(entry.startDate).toLocaleDateString("en-IN")}</p>
      <p><strong>Duration:</strong> {months} months, {days} days</p>
      <p><strong>Interest Till Today:</strong> ₹{interest}</p>
      <p><strong>Total Due:</strong> ₹{totalDue}</p>

      <div className="update-actions">
        <button onClick={() => setMode("clear")} className="delete-btn">❌ Clear Total Due</button>
        <button onClick={() => setMode("rewrite")} className="edit-btn">✏️ Rewrite Loan</button>
        <button onClick={() => setMode("interest")} className="interest-btn">🧾 Pay Interest Only</button>
      </div>

      {mode === "clear" && (
        <div className="confirm-clear">
          <p>Are you sure you want to clear this loan?</p>
          <button onClick={handleDelete}>✅ Yes, Clear</button>
        </div>
      )}

      {mode === "rewrite" && (
        <div className="rewrite-section">
          <p>Total Due (Amount + Interest): ₹{totalDue}</p>
          <input
            type="number"
            placeholder="Enter amount paid"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
          />
          <button onClick={handleRewrite}>🔁 Rewrite Loan</button>
        </div>
      )}

      {mode === "interest" && (
        <div className="interest-clear">
          <p>Interest Till Now: ₹{interest}</p>
          <input
            type="number"
            placeholder="Enter interest amount to pay"
            value={interestToPay}
            onChange={(e) => setInterestToPay(e.target.value)}
          />
          <button onClick={handleClearInterestOnly}>✅ Pay Interest</button>
        </div>
      )}

      {mode === "" && (
        <form onSubmit={handleUpdate} className="update-form">
          <input
            type="number"
            name="amount"
            placeholder="New amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <input
            type="number"
            name="rate"
            placeholder="New interest rate"
            value={form.rate}
            onChange={(e) => setForm({ ...form, rate: e.target.value })}
            required
          />
          <button type="submit">✅ Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default PayerUpdate;
