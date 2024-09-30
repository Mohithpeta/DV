require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const passport = require('./passport');
const session = require('express-session');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// Google Client ID
const client = new OAuth2Client(process.env.CLIENT_ID);

// User model
const User = require('./models/User');
const BloodPressure = require('./models/BloodPressure');
const SpO2 = require('./models/SpO2');
const Weight = require('./models/WeightData');

// Initialize express app
const app = express();

// Create HTTP server and initialize socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(bodyParser.json());

// Secure session handling with cookies
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 3600000 // 1 hour expiration
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Authentication Middleware
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('Unauthorized');
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Forbidden');
    req.user = user;
    next();
  });
};

// Function to create a JWT token for the user
const createTokenForUser = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Google Sign-Up route
app.post('/api/auth/google/signup', async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists. Please log in instead.' });
    }

    user = new User({ fullname: name, email });
    await user.save();

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error logging in: ' + err.message });
      }
      const token = createTokenForUser(user);
      res.status(201).json({ message: 'Signed up successfully', accessToken: token, user });
    });
  } catch (error) {
    console.error('Error during Google Sign-Up:', error);
    res.status(400).json({ error: 'Invalid Google token: ' + error.message });
  }
});

// Google Login route
app.post('/api/auth/google/login', async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ fullname: name, email });
      await user.save();
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error logging in: ' + err.message });
      }
      const token = createTokenForUser(user);
      res.status(200).json({ message: 'Logged in successfully', accessToken: token, user });
    });
  } catch (error) {
    console.error('Error during Google Login:', error);
    res.status(400).json({ error: 'Invalid Google token: ' + error.message });
  }
});

// Logout route
app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out: ' + err.message });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Blood pressure POST route
app.post('/api/bloodpressure', [
  check('systolic').isNumeric().withMessage('Systolic value must be numeric'),
  check('diastolic').isNumeric().withMessage('Diastolic value must be numeric')
], requireAuth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { systolic, diastolic, timestamp } = req.body;
  const bloodPressure = new BloodPressure({
    systolic,
    diastolic,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
  });

  try {
    await bloodPressure.save();
    res.status(201).send(bloodPressure);
    io.emit('newBloodPressure', bloodPressure);  // Emit real-time updates to frontend
  } catch (error) {
    res.status(400).send('Error saving blood pressure entry: ' + error.message);
  }
});

// Blood pressure GET route
app.get('/api/bloodpressure', requireAuth, async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalEntries = await BloodPressure.countDocuments();
    const data = await BloodPressure.find()
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(limit);

    res.set('x-total-count', totalEntries);
    res.status(200).json({
      data,
      currentPage: page,
      totalEntries,
      hasMore: page * limit < totalEntries,
    });
  } catch (error) {
    res.status(500).send('Error retrieving blood pressure data: ' + error.message);
  }
});

// SpO2 POST route
app.post('/api/spo2', [
  check('spO2').isNumeric().withMessage('SpO2 value must be numeric')
], requireAuth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { spO2, timestamp } = req.body;
  const newSpO2 = new SpO2({ spO2, timestamp: timestamp ? new Date(timestamp) : new Date() });

  try {
    await newSpO2.save();
    res.status(201).json(newSpO2);
    io.emit('newSpO2', newSpO2);  // Emit real-time updates to frontend
  } catch (error) {
    res.status(500).json({ error: 'Error saving SpO2 data: ' + error.message });
  }
});

// SpO2 GET route
app.get('/api/spo2', requireAuth, async (req, res) => {
  try {
    const spo2Data = await SpO2.find().sort({ timestamp: 1 });
    res.json(spo2Data);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving SpO2 data: ' + err.message });
  }
});

// Weight POST route
app.post('/api/weight', [
  check('weight').isNumeric().withMessage('Weight value must be numeric'),
  check('day').isString().withMessage('Day must be a string')
], requireAuth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { weight, day, timestamp } = req.body;
  const newWeight = new Weight({ weight, day, timestamp: timestamp ? new Date(timestamp) : new Date() });

  try {
    await newWeight.save();
    res.status(201).json(newWeight);
    io.emit('newWeight', newWeight);  // Emit real-time updates to frontend
  } catch (error) {
    res.status(500).json({ error: 'Error saving weight data: ' + error.message });
  }
});

// Weight GET route
app.get('/api/weight', requireAuth, async (req, res) => {
  try {
    const weightData = await Weight.find().sort({ timestamp: 1 });
    res.json(weightData);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving weight data: ' + err.message });
  }
});

// Listen on specified port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
