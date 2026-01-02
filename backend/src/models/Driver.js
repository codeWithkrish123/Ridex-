// src/models/Driver.js
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vehicle: {
    make: {
      type: String,
      required: [true, 'Please add vehicle make'],
    },
    model: {
      type: String,
      required: [true, 'Please add vehicle model'],
    },
    year: {
      type: Number,
      required: [true, 'Please add vehicle year'],
    },
    color: String,
    licensePlate: {
      type: String,
      required: [true, 'Please add license plate number'],
      uppercase: true,
    },
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please add driver license number'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
    address: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  totalRides: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

// Create geospatial index for location-based queries
driverSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);