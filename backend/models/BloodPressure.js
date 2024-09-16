const mongoose = require('mongoose');

const bloodPressureSchema = new mongoose.Schema({
  systolic: {
    type: Number,
    required: true,
  },
  diastolic: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('BloodPressure', bloodPressureSchema);