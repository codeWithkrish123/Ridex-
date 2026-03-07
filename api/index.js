const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../backend/src/config/db');

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const userRoutes = require('../backend/src/routes/user.routes');
const rideRoutes = require('../backend/src/routes/ride.routes');
const mapsRoutes = require('../backend/src/routes/maps.routes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/maps', mapsRoutes);

app.get('/', (req, res) => {
  res.send('RideX API is running on Vercel');
});

module.exports = app;
