const express = require('express');
const { createBloodPressureEntry, getBloodPressureEntries } = require('../controllers/bpController');
const { authenticate } = require('../middleware/authMiddleware'); // Authentication middleware
const router = express.Router();

router.post('/', authenticate, createBloodPressureEntry);
router.get('/', authenticate, getBloodPressureEntries);

module.exports = router;