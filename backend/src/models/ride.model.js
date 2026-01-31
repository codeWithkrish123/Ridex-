const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    pickup: {
        address: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number }
    },
    destination: {
        address: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number }
    },
    fare: {
        type: Number,
        required: true
    },
    tip: {
        type: Number,
        default: 0
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ['auto', 'car', 'moto', 'RideX Go', 'RideX Comfort', 'RideX Black', 'RideX XL']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    duration: {
        type: Number, // in seconds
    },
    distance: {
        type: Number, // in meters
    },
    otp: {
        type: String,
        select: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
