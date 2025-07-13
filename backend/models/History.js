const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  borrowerName: { type: String, required: true },
  amount: { type: Number, required: true },       // Original principal amount
  rate: { type: Number, required: true },
  startDate: { type: Date, required: true },
  userId: { type: String, required: true },
  entryId: { type: String, required: true },

  totalInterest: { type: Number, required: true },     // ✅ New field
  totalAmountPaid: { type: Number, required: true },   // ✅ New field

  clearedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("History", historySchema);
