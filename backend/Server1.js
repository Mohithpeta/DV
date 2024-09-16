const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User'); // Assuming you have a User model

// Create an Express application
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Cookie-session middleware (for session management)
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  keys: ['YOUR_COOKIE_KEY'] // Use a secure key
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection (single connection for all components)
const mongoURI = 'mongodb://localhost:27017/healthdata'; // Use a single MongoDB database for all components
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// ----------- Google OAuth2 Setup ------------
passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const existingUser = await User.findOne({ googleId: profile.id });
  if (existingUser) {
    return done(null, existingUser);
  }
  const newUser = await new User({ googleId: profile.id }).save();
  done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// ----------- Authentication Routes ------------
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile']
}));

app.get('/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    res.redirect('/dashboard'); // Redirect to dashboard or any protected route
  }
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

// Middleware to check authentication for protected routes
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(403).send('You must log in!');
  }
  next();
};

// ----------- Blood Pressure Component ------------
const bloodPressureSchema = new mongoose.Schema({
  systolic: Number,
  diastolic: Number,
  timestamp: String,
});

const BloodPressure = mongoose.model('BloodPressure', bloodPressureSchema);

// POST: Add a new blood pressure entry (Protected)
app.post('/api/bloodpressure', requireAuth, async (req, res) => {
  const bloodPressure = new BloodPressure(req.body);
  try {
    await bloodPressure.save();
    res.status(201).send(bloodPressure);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET: Retrieve blood pressure data (with pagination)
app.get('/api/bloodpressure', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const data = await BloodPressure.find()
      .sort({ timestamp: 1 }) // Sort by timestamp in ascending order
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalEntries = await BloodPressure.countDocuments();
    const hasMore = page * limit < totalEntries;

    res.status(200).json({ data, currentPage: page, totalEntries, hasMore });
  } catch (error) {
    res.status(500).send(error);
  }
});

// ----------- SpO2 Component ------------
const spo2Schema = new mongoose.Schema({
  spO2: Number,
  timestamp: Date,
});

const SpO2 = mongoose.model('SpO2', spo2Schema);

// POST: Add a new SpO2 entry (Protected)
app.post('/api/spo2', requireAuth, async (req, res) => {
  const { spO2, timestamp } = req.body;
  const newSpO2 = new SpO2({ spO2, timestamp });
  try {
    await newSpO2.save();
    res.status(201).json(newSpO2);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET: Retrieve SpO2 data
app.get('/api/spo2', async (req, res) => {
  try {
    const spo2Data = await SpO2.find().sort({ timestamp: 1 });
    res.json(spo2Data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------- Weight Chart Component ------------
const weightSchema = new mongoose.Schema({
  weight: Number,
  day: String,
  timestamp: String,
});

const Weight = mongoose.model('Weight', weightSchema);

// GET: Fetch weight data
app.get('/api/weightdata', async (req, res) => {
  try {
    const weights = await Weight.find().sort({ timestamp: 1 });
    res.json(weights);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// POST: Add new weight data (Protected)
app.post('/api/weight', requireAuth, async (req, res) => {
  const { weight, day, timestamp } = req.body;
  if (!weight || !day) {
    return res.status(400).json({ error: 'Weight and day are required' });
  }

  try {
    const newWeight = new Weight({ weight, day, timestamp });
    await newWeight.save();
    res.json(newWeight);
  } catch (error) {
    res.status(500).json({ error: 'Error saving data' });
  }
});

// POST: Insert sample data if none exists (Protected)
app.post('/api/sampledata', requireAuth, async (req, res) => {
  try {
    const existingData = await Weight.find();

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
    res.status(500).json({ error: 'Error inserting sample data' });
  }
});

// Start the server on a single port
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
