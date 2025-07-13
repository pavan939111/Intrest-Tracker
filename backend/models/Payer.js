const mongoose = require("mongoose");

const PayerSchema = new mongoose.Schema({
  lenderName: { type: String, required: true },
  amount: { type: Number, required: true },
  rate: { type: Number, required: true },
  startDate: { type: Date, required: true },
  userId: { type: String, required: true },
  // entryId is removed — MongoDB will auto-generate _id
});

module.exports = mongoose.model("Payer", PayerSchema);
