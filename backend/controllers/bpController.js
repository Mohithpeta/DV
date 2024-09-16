const BloodPressure = require('../models/BloodPressure');

const createBloodPressureEntry = async (req, res) => {
  const { systolic, diastolic, timestamp } = req.body;

  try {
    const bloodPressureEntry = new BloodPressure({
      systolic,
      diastolic,
      timestamp,
      user: req.user.id, // Get user ID from the token
    });
    await bloodPressureEntry.save();
    res.status(201).json(bloodPressureEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBloodPressureEntries = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const bloodPressureEntries = await BloodPressure.find({ user: req.user.id }) // Get entries for the authenticated user
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ timestamp: -1 });

    const totalCount = await BloodPressure.countDocuments({ user: req.user.id });
    res.set('x-total-count', totalCount); // Set total count in headers
    res.json(bloodPressureEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createBloodPressureEntry, getBloodPressureEntries };