const express = require('express');
const { createSpO2Entry, getSpO2Entries } = require('../controllers/spo2Controller');
const { authenticate } = require('../middleware/authMiddleware'); // Authentication middleware
const router = express.Router();

router.post('/', authenticate, createSpO2Entry);
router.get('/', authenticate, getSpO2Entries);

module.exports = router;