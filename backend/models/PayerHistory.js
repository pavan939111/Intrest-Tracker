const mongoose = require("mongoose");

const payerHistorySchema = new mongoose.Schema({
  lenderName: String,
  amount: Number,
  rate: Number,
  startDate: Date,
  userId: String,
  entryId: String,
  clearedAt: {
    type: Date,
    default: Date.now,
  },
  totalInterest: Number,
  totalAmountPaid: Number,
});

module.exports = mongoose.model("PayerHistory", payerHistorySchema);
