const mongoose = require('mongoose');

const weightDataSchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  day: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeightData', weightDataSchema);
