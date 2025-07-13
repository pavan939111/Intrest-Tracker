const express = require("express");
const router = express.Router();
const Payer = require("../models/Payer");
const PayerHistory = require("../models/PayerHistory");

// GET single entry by MongoDB _id
router.get("/entry/:id", async (req, res) => {
  try {
    const entry = await Payer.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET history
router.get("/history/:userId", async (req, res) => {
  try {
    const history = await PayerHistory.find({ userId: req.params.userId }).sort({ clearedAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all entries by user
router.get("/:userId", async (req, res) => {
  try {
    const entries = await Payer.find({ userId: req.params.userId });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new payer entry
router.post("/", async (req, res) => {
  try {
    const { lenderName, amount, rate, startDate, userId } = req.body;
    if (!lenderName || !amount || !rate || !startDate || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEntry = new Payer({ lenderName, amount, rate, startDate, userId });
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update entry by _id
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Payer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Entry not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE entry by _id (move to history)
router.delete("/:id", async (req, res) => {
  try {
    const entry = await Payer.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    const historyEntry = new PayerHistory({
      lenderName: entry.lenderName,
      amount: entry.amount,
      rate: entry.rate,
      startDate: entry.startDate,
      userId: entry.userId,
      clearedAt: new Date(),
    });

    await historyEntry.save();
    await entry.deleteOne();
    res.json({ message: "Entry cleared and moved to history" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
