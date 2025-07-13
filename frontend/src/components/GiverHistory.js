import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/giver.css";

const GiverHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await axios.get(`https://intrest-tracker.onrender.com/api/giver/history/${user._id}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history:", err.message);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="giver-history">
      <h2>📜 Cleared Lending History</h2>
      {history.length === 0 ? (
        <p>No past records.</p>
      ) : (
        history.map((record) => (
          <div key={record.entryId} className="giver-entry">
            <p><strong>{record.borrowerName}</strong></p>
            <p>₹{record.amount} at {record.rate}%</p>
            <p>Start Date: {new Date(record.startDate).toLocaleDateString()}</p>
            <p>Cleared On: {new Date(record.clearedAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default GiverHistory;
