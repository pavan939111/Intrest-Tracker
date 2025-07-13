// 📁 components/Calculator.js
import React, { useState } from "react";
import "../css/calculator.css";

const Calculator = () => {
  const [form, setForm] = useState({
    principal: "",
    rate: "",
    startDate: "",
    endDate: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateInterest = (e) => {
    e.preventDefault();
    const { principal, rate, startDate, endDate } = form;
    const p = parseFloat(principal);
    const r = parseFloat(rate);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(p) || isNaN(r) || end <= start) {
      alert("❌ Invalid input or date range");
      return;
    }

    const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    const totalMonths = Math.floor(totalDays / 30);
    const monthStart = new Date(start);
    monthStart.setMonth(monthStart.getMonth() + totalMonths);
    const remainingDays = Math.floor((end - monthStart) / (1000 * 60 * 60 * 24));

    const monthlyInterest = (p / 100) * r;
    const dailyInterest = monthlyInterest / 30;
    const interest = totalMonths * monthlyInterest + remainingDays * dailyInterest;
    const total = p + interest;

    setResult({
      totalDays,
      totalMonths,
      remainingDays,
      monthlyInterest: monthlyInterest.toFixed(2),
      dailyInterest: dailyInterest.toFixed(2),
      totalInterest: interest.toFixed(2),
      totalAmount: total.toFixed(2),
    });
  };

  return (
    <div className="calculator-container">
      <form onSubmit={calculateInterest} className="calculator-form">
        <h2 className="calculator-title">Interest Calculator</h2>

        <label>Principal Amount</label>
        <input
          type="number"
          name="principal"
          value={form.principal}
          onChange={handleChange}
          required
        />

        <label>Interest Rate (per ₹100 per month)</label>
        <input
          type="number"
          name="rate"
          value={form.rate}
          onChange={handleChange}
          required
        />

        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
        />

        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          required
        />

        <button type="submit">Calculate</button>
      </form>

      {/* ✅ Result displayed beside form on desktop, below on mobile */}
      {result && (
        <div className="calculator-result">
          <p>🗓️ Months: <strong>{result.totalMonths}</strong>, Days: <strong>{result.remainingDays}</strong></p>
          <p>💰 Monthly Interest: ₹<strong>{result.monthlyInterest}</strong></p>
          <p>📆 Daily Interest: ₹<strong>{result.dailyInterest}</strong></p>
          <p>💸 Total Interest: ₹<strong>{result.totalInterest}</strong></p>
          <p>🧾 Final Amount: ₹<strong>{result.totalAmount}</strong></p>
        </div>
      )}
    </div>
  );
};

export default Calculator;
