const express = require("express");
const router = express.Router();
const Giver = require("../models/Giver");
const History = require("../models/History");

// Utility function to calculate duration and interest
const calculateInterestData = (entry) => {
  const start = new Date(entry.startDate);
  const end = new Date();
  const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30);
  const remainingDays = totalDays % 30;

  const monthlyInterest = (entry.amount / 100) * entry.rate;
  const dailyInterest = monthlyInterest / 30;
  const totalInterest = months * monthlyInterest + remainingDays * dailyInterest;
  const totalAmountPaid = entry.amount + totalInterest;

  return {
    months,
    remainingDays,
    totalInterest: +totalInterest.toFixed(2),
    totalAmountPaid: +totalAmountPaid.toFixed(2),
  };
};

// ✅ Create a new entry
router.post("/", async (req, res) => {
  try {
    const { borrowerName, amount, rate, startDate, userId, entryId } = req.body;

    const newEntry = new Giver({
      borrowerName,
      amount,
      rate,
      startDate,
      userId,
      entryId,
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ message: "Failed to create entry", error: err.message });
  }
});

// ✅ Get all entries for a user
router.get("/:userId", async (req, res) => {
  try {
    const entries = await Giver.find({ userId: req.params.userId });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Fetch error", error: err.message });
  }
});

// ✅ Get single entry by entryId
router.get("/entry/:entryId", async (req, res) => {
  try {
    const entry = await Giver.findOne({ entryId: req.params.entryId });
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Fetch error", error: err.message });
  }
});

// ✅ Update entry by entryId
router.patch("/:entryId", async (req, res) => {
  try {
    const updated = await Giver.findOneAndUpdate(
      { entryId: req.params.entryId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Entry not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update error", error: err.message });
  }
});

// ✅ Delete and archive to history
router.delete("/:entryId", async (req, res) => {
  try {
    const entry = await Giver.findOne({ entryId: req.params.entryId });
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    const interestData = calculateInterestData(entry);

    const historyRecord = new History({
      borrowerName: entry.borrowerName,
      amount: entry.amount,
      rate: entry.rate,
      startDate: entry.startDate,
      userId: entry.userId,
      entryId: entry.entryId,
      clearedAt: new Date(),
      totalInterest: interestData.totalInterest,
      totalAmountPaid: interestData.totalAmountPaid,
    });

    await historyRecord.save();
    await Giver.deleteOne({ entryId: req.params.entryId });

    res.json({ message: "Entry cleared and archived to history." });
  } catch (err) {
    res.status(500).json({ message: "Delete error", error: err.message });
  }
});

// ✅ Get history entries
router.get("/history/:userId", async (req, res) => {
  try {
    const history = await History.find({ userId: req.params.userId }).sort({ clearedAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to load history", error: err.message });
  }
});
// PATCH /api/giver/:entryId
router.patch("/:entryId", async (req, res) => {
  try {
    const updated = await Giver.findOneAndUpdate(
      { entryId: req.params.entryId },
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});


module.exports = router;
