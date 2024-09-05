const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/healthdata', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a schema for SpO2 data
const spo2Schema = new mongoose.Schema({
  spO2: Number,
  timestamp: Date
});

// Create a model for SpO2 data
const SpO2 = mongoose.model('SpO2', spo2Schema);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/spo2', async (req, res) => {
  try {
    const { spO2, timestamp } = req.body;
    const newSpO2 = new SpO2({ spO2, timestamp });
    await newSpO2.save();
    res.status(201).json(newSpO2);
  } catch (error) {
    console.error('Error saving new SpO2 data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/spo2', async (req, res) => {
  try {
    const spo2Data = await SpO2.find().sort({ timestamp: 1 });
    res.json(spo2Data);
  } catch (err) {
    console.error('Error fetching SpO2 data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = 5001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
