// src/routes/driver.routes.js
const express = require('express');
const { check } = require('express-validator');

const {
  updateLocation,
  acceptRide,
  completeRide,
  getAvailableDrivers,
} = require('../controllers/driver.controller');

const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('driver'));

router.put(
  '/location',
  check('latitude', 'Latitude is required').isNumeric(),
  check('longitude', 'Longitude is required').isNumeric(),
  validate,
  updateLocation
);

router.put('/accept-ride/:rideId', acceptRide);
router.put('/complete-ride/:rideId', completeRide);
router.get('/available', getAvailableDrivers);

module.exports = router;