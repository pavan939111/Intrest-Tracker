// 📁 App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Calculator from "./components/Calculator";
import Giver from "./components/GiverView";
import Payer from "./components/PayerView";
import Update from "./components/UpdateModal";
import ProtectedRoute from "./components/ProtectedRoute";
import GiverHistory from "./components/GiverHistory";
import PayerUpdate from "./components/PayerUpdate";
import "./css/global.css"; 

function App() {
  return (
    <>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/calculator" element={<Calculator />} />

          {/* Protected Routes */}
          <Route path="/giver/history" element={<GiverHistory />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/giver" element={<ProtectedRoute><Giver /></ProtectedRoute>} />
          <Route path="/payer" element={<ProtectedRoute><Payer /></ProtectedRoute>} />
          <Route path="/update/:entryId" element={<ProtectedRoute><Update /></ProtectedRoute>} />
          {/* <Route path="/updatePayer/:entryId" element={<ProtectedRoute><PayerUpdate /></ProtectedRoute>} /> */}
          <Route path="/updatePayer/:id" element={<PayerUpdate />} />

        </Routes>
      </div>
    </>
  );
}

export default App;
