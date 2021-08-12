const mongoose = require("mongoose");

const accessSchema = new mongoose.Schema({
  user: { type: String, required: true },
  servers: { type: [String], default: [] },
  tokens: { type: {
    access: { type: String, required: true },
    refresh: { type: String, required: true }
  }, default: {} },
  expires: { type: Date, required: true },
});

const Access = mongoose.model("Access", accessSchema);

module.exports = Access;