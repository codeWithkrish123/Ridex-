const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();


const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:8080',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const userRoutes = require('./routes/user.routes');
const rideRoutes = require('./routes/ride.routes');
const mapsRoutes = require('./routes/maps.routes');

app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/maps', mapsRoutes);

app.get('/', (req, res) => {
  res.send('RideX API is running');
});

module.exports = app;
