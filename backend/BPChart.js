const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bloodPressureDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Mongoose Schema and Model
const bloodPressureSchema = new mongoose.Schema({
    systolic: Number,
    diastolic: Number,
    timestamp: String
});

const BloodPressure = mongoose.model('BloodPressure', bloodPressureSchema);

// Routes
// POST: Add a new blood pressure entry
app.post('/api/bloodpressure', async (req, res) => {
    const bloodPressure = new BloodPressure(req.body);
    try {
        await bloodPressure.save();
        res.status(201).send(bloodPressure);
    } catch (error) {
        res.status(400).send(error);
    }
});


//to ensure the time stamps are in increasing order
app.get('/api/bloodpressure', async (req, res) => {
  try {
      const data = await BloodPressure.find().sort({ timestamp: 1 }); // Sorting by timestamp in ascending order
      res.status(200).json(data);
  } catch (error) {
      res.status(500).send(error);
  }
});

//to view only 10 values per page
app.get('/api/bloodpressure', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
      const count = await BloodPressure.countDocuments();
      const data = await BloodPressure.find()
          .sort({ timestamp: 1 })
          .skip(skip)
          .limit(limit);

      res.set('x-total-count', count); // Send total count in headers
      res.status(200).json(data);
  } catch (error) {
      res.status(500).send(error);
  }
});


// GET: Retrieve blood pressure data with pagination
app.get('/api/bloodpressure', async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    try {
        const data = await BloodPressure.find()
            .sort({ timestamp: 1 }) // Sort by timestamp in ascending order
            .skip((page - 1) * limit) // Skip the previous pages
            .limit(parseInt(limit)); // Limit the results to the specified number

        const totalEntries = await BloodPressure.countDocuments();
        const hasMore = page * limit < totalEntries; // Check if there are more entries

        res.status(200).json({
            data,
            currentPage: page,
            totalEntries,
            hasMore,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start server
app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});
