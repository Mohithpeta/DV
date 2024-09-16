const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/weighttracker'; // Default MongoDB port is 27017
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Define a schema and model for weight data
const weightSchema = new mongoose.Schema({
  weight: Number,
  day: String,
  timestamp: String
});

const Weight = mongoose.model('Weight', weightSchema);

// Routes
// Fetch weight data from database
app.get('/api/weightdata', async (req, res) => {
  try {
    const weights = await Weight.find().sort({ timestamp: 1 }); // Sort by timestamp ascending
    res.json(weights);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// Add new weight data
app.post('/api/weight', async (req, res) => {
  const { weight, day, timestamp } = req.body;
  
  // Validation to ensure weight and day are provided
  if (!weight || !day) {
    return res.status(400).json({ error: 'Weight and day are required' });
  }

  try {
    const newWeight = new Weight({ weight, day, timestamp });
    await newWeight.save();
    res.json(newWeight);
  } catch (error) {
    console.error("Error saving data:", error.message);
    res.status(500).json({ error: 'Error saving data' });
  }
});

// Add sample data to the database if none exists
app.post('/api/sampledata', async (req, res) => {
  try {
    const existingData = await Weight.find();

    // Only insert sample data if no data exists
    if (existingData.length === 0) {
      const sampleData = [
        { weight: 70, day: 'Mon', timestamp: '2024-09-09T00:00:00Z' },
        { weight: 72, day: 'Tue', timestamp: '2024-09-10T00:00:00Z' },
        { weight: 71, day: 'Wed', timestamp: '2024-09-11T00:00:00Z' },
        { weight: 69, day: 'Thu', timestamp: '2024-09-12T00:00:00Z' },
        { weight: 68, day: 'Fri', timestamp: '2024-09-13T00:00:00Z' },
        { weight: 70, day: 'Sat', timestamp: '2024-09-14T00:00:00Z' },
        { weight: 71, day: 'Sun', timestamp: '2024-09-15T00:00:00Z' }
      ];

      await Weight.insertMany(sampleData);
      res.status(201).json({ message: 'Sample data inserted successfully' });
    } else {
      res.status(200).json({ message: 'Sample data already exists' });
    }
  } catch (error) {
    console.error('Error inserting sample data:', error.message);
    res.status(500).json({ error: 'Error inserting sample data' });
  }
});

// Start the server on port 5010
const PORT = 5010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
