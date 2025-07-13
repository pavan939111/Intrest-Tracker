const mongoose = require("mongoose");

const giverSchema = new mongoose.Schema({
  borrowerName: { type: String, required: true },
  amount: { type: Number, required: true },
  rate: { type: Number, required: true },
  startDate: { type: Date, required: true },
  userId: { type: String, required: true },
  entryId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Giver", giverSchema);



