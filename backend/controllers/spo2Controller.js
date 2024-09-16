const SpO2 = require('../models/SpO2');

const createSpO2Entry = async (req, res) => {
  const { spO2, timestamp } = req.body;

  try {
    const spO2Entry = new SpO2({
      spO2,
      timestamp,
      user: req.user.id, // Get user ID from the token
    });
    await spO2Entry.save();
    res.status(201).json(spO2Entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSpO2Entries = async (req, res) => {
  try {
    const spO2Entries = await SpO2.find({ user: req.user.id }).sort({ timestamp: -1 });
    res.json(spO2Entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createSpO2Entry, getSpO2Entries };