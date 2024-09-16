const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/weightdata', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a schema for Weight data
const weightSchema = new mongoose.Schema({
  weight: Number,
  day: String,
  timestamp: Date
});

// Create a model for Weight data
const Weight = mongoose.model('Weight', weightSchema);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/weight', async (req, res) => {
  try {
    const weightData = await Weight.find().sort({ timestamp: 1 });
    res.json(weightData);
  } catch (err) {
    console.error('Error fetching weight data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/weight', async (req, res) => {
  const { weight, day, timestamp } = req.body;

  try {
    const newWeight = new Weight({ weight, day, timestamp });
    await newWeight.save();
    res.status(201).json(newWeight);
  } catch (err) {
    console.error('Error saving weight data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = 5002;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
