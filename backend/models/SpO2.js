const mongoose = require('mongoose');

const spO2Schema = new mongoose.Schema({
  spO2: {
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

module.exports = mongoose.model('SpO2', spO2Schema);