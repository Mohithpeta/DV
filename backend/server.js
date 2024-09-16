const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const bloodPressureRoutes = require('./routes/bloodPressure');
const spo2Routes = require('./routes/spo2');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bloodpressure', bloodPressureRoutes);
app.use('/api/spo2', spo2Routes);

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});