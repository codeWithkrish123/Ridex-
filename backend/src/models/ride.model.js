const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pickup: {
        address: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    destination: {
        address: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    fare: {
        type: Number,
        required: true
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ['auto', 'car', 'moto']
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
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
    otp: {
        type: String,
        select: false,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
