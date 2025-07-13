import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/update.css";

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

const Update = () => {
  const { entryId } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [mode, setMode] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [interestToPay, setInterestToPay] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`https://intrest-tracker.onrender.com/api/giver/entry/${entryId}`)
      .then((res) => {
        setEntry(res.data);
      })
      .catch(() => setError("❌ Failed to fetch entry."))
      .finally(() => setLoading(false));
  }, [entryId]);

  if (loading) return <p>Loading...</p>;
  if (error || !entry) return <p className="error-message">{error}</p>;

  const { months, days } = calculateDuration(entry.startDate);
  const interest = calculateInterest(entry.amount, entry.rate, entry.startDate).toFixed(2);
  const totalDue = (parseFloat(entry.amount) + parseFloat(interest)).toFixed(2);
  const moneyPaid = entry.moneyPaid || 0;

  const handleDelete = async () => {
    try {
      await axios.delete(`https://intrest-tracker.onrender.com/api/giver/${entryId}`);
      navigate("/giver");
    } catch {
      setError("❌ Delete failed.");
    }
  };

  const handleRewrite = async () => {
    const interestNum = parseFloat(interest);
    const totalNewLoan = parseFloat(entry.amount) + interestNum;
    const paid = parseFloat(paidAmount);

    if (isNaN(paid) || paid < 0 || paid > totalNewLoan) {
      setError("Invalid payment amount.");
      return;
    }

    const newPrincipal = totalNewLoan - paid;

    try {
      await axios.patch(`https://intrest-tracker.onrender.com/api/giver/${entryId}`, {
        amount: newPrincipal.toFixed(2),
        startDate: new Date(),
        moneyPaid: paid,
      });
      navigate("/giver");
    } catch {
      setError("❌ Rewrite failed.");
    }
  };

  const handleClearInterestOnly = async () => {
    const pay = parseFloat(interestToPay);

    if (isNaN(pay) || pay <= 0 || pay > parseFloat(interest)) {
      setError("Invalid interest amount.");
      return;
    }

    const updatedAmount = parseFloat(entry.amount) + (parseFloat(interest) - pay);

    try {
      await axios.patch(`https://intrest-tracker.onrender.com/api/giver/${entryId}`, {
        amount: updatedAmount.toFixed(2),
        moneyPaid: pay,
      });
      navigate("/giver");
    } catch {
      setError("❌ Interest payment failed.");
    }
  };

  return (
    <div className="update-page">
      {/* ✅ Responsive Header */}
      <div className="update-header">
        <h2>Update Lending Details</h2>
        <button className="go-back-btn" onClick={() => navigate(-1)}>⬅️ Go Back</button>
      </div>

      <p><strong>Borrower:</strong> {entry.borrowerName}</p>
      <p><strong>Start Date:</strong> {new Date(entry.startDate).toLocaleDateString("en-IN")}</p>
      <p><strong>Duration:</strong> {months} months, {days} days</p>
      <p><strong>Interest:</strong> ₹{interest}</p>
      <p><strong>Total Due:</strong> ₹{totalDue}</p>
      <p><strong>Money Paid Upto:</strong> ₹{moneyPaid}</p>

      <div className="update-actions">
        <button onClick={() => setMode("clear")} className="delete-btn">❌ Clear Total Due</button>
        <button onClick={() => setMode("rewrite")} className="edit-btn">✏️ Rewrite Lender</button>
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
            placeholder="Enter amount paid (min: interest)"
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
    </div>
  );
};

export default Update;
