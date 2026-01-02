// src/controllers/ride.controller.js
const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { getIO } = require('../services/socket.service');

// @desc    Request a ride
// @route   POST /api/v1/rides
// @access  Private
const requestRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { pickupLocation, dropoffLocation, distance, estimatedDuration } = req.body;

    // Calculate fare (simple calculation, can be replaced with more complex logic)
    const baseFare = 2.5; // Base fare in currency
    const ratePerMile = 1.5; // Rate per mile
    const fare = baseFare + (distance * ratePerMile);

    const ride = await Ride.create({
      rider: req.user.id,
      pickupLocation: {
        type: 'Point',
        coordinates: [
          pickupLocation.longitude,
          pickupLocation.latitude,
        ],
        address: pickupLocation.address,
      },
      dropoffLocation: {
        type: 'Point',
        coordinates: [
          dropoffLocation.longitude,
          dropoffLocation.latitude,
        ],
        address: dropoffLocation.address,
      },
      distance,
      estimatedDuration,
      fare,
    });

    // Get the populated ride
    const populatedRide = await Ride.findById(ride._id).populate('rider', 'name email phone');

    // Emit new ride request to all drivers
    const io = getIO();
    io.emit('new_ride_request', populatedRide);

    res.status(201).json({ success: true, data: populatedRide });
  } catch (err) {
    logger.error(`Request ride error: ${err.message}`);
    next(err);
  }
};

// @desc    Get ride by ID
// @route   GET /api/v1/rides/:id
// @access  Private
const getRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('rider', 'name email phone')
      .populate('driver', 'user vehicle');

    if (!ride) {
      return next(
        new ErrorResponse(`Ride not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is ride owner or admin
    if (
      ride.rider._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to access this ride`,
          401
        )
      );
    }

    res.status(200).json({ success: true, data: ride });
  } catch (err) {
    logger.error(`Get ride error: ${err.message}`);
    next(err);
  }
};

// @desc    Get current user's rides
// @route   GET /api/v1/rides/my-rides
// @access  Private
const getMyRides = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'driver') {
      // If user is a driver, get rides assigned to them
      const driver = await Driver.findOne({ user: req.user.id });
      query = { driver: driver._id };
    } else {
      // If user is a rider, get their rides
      query = { rider: req.user.id };
    }

    const rides = await Ride.find(query)
      .sort('-createdAt')
      .populate('rider', 'name email phone')
      .populate('driver', 'user vehicle');

    res.status(200).json({ success: true, count: rides.length, data: rides });
  } catch (err) {
    logger.error(`Get my rides error: ${err.message}`);
    next(err);
  }
};

// @desc    Complete a ride
// @route   PUT /api/v1/rides/:id/complete
// @access  Private
const completeRide = async (req, res, next) => {
  try {
    let ride = await Ride.findById(req.params.id);

    if (!ride) {
      return next(
        new ErrorResponse(`Ride not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is the driver assigned to the ride
    if (ride.driver.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to complete this ride`,
          401
        )
      );
    }

    // Update ride status and completion time
    ride.status = 'completed';
    ride.completedAt = Date.now();
    await ride.save();

    // Get the populated ride
    ride = await Ride.findById(ride._id)
      .populate('rider', 'name email phone')
      .populate('driver', 'user vehicle');

    // Notify rider that ride is completed
    const io = getIO();
    io.to(`ride_${ride._id}`).emit('ride_completed', ride);

    res.status(200).json({ success: true, data: ride });
  } catch (err) {
    logger.error(`Complete ride error: ${err.message}`);
    next(err);
  }
};
module.exports = {
  requestRide,
  getRide,
  getMyRides,
  completeRide,
};
