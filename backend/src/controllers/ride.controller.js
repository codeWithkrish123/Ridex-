const Ride = require('../models/ride.model');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// @desc    Create a new ride
// @route   POST /api/rides/create
// @access  Private (User)
exports.createRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { pickup, destination, vehicleType, fare, tip, capacity } = req.body;

        logger.debug('Creating ride with data:', { pickup, destination, vehicleType, fare, tip, capacity, userId: req.user.id });

        const newRide = await Ride.create({
            user: req.user.id,
            pickup,
            destination,
            vehicleType,
            fare,
            tip,
            capacity,
            otp: getOtp(4),
        });

        logger.info('Ride created successfully', { rideId: newRide._id, userId: req.user.id });

        res.status(201).json(newRide);
    } catch (err) {
        logger.error('Error creating ride', { error: err.message, userId: req.user?.id });
        return res.status(500).json({ message: err.message });
    }
};

// @desc    Get user rides
// @route   GET /api/rides/user-rides
// @access  Private (User)
exports.getUserRides = async (req, res) => {
    try {
        const rides = await Ride.find({ user: req.user.id }).sort({ createdAt: -1 });
        logger.debug('Retrieved user rides', { userId: req.user.id, count: rides.length });
        res.status(200).json(rides);
    } catch (err) {
        logger.error('Error getting user rides', { error: err.message, userId: req.user?.id });
        res.status(500).json({ message: err.message });
    }
};


// @desc    Update ride status and add tip
// @route   PUT /api/rides/:id
// @access  Private (User/Driver)
exports.updateRide = async (req, res) => {
    try {
        const { status, tip, paymentStatus } = req.body;
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            logger.warn('Ride not found for update', { rideId: req.params.id, userId: req.user?.id });
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Allow user or assigned driver to update
        // Note: For stricter security, you should verify if req.user.id matches ride.user or ride.driver

        if (status) ride.status = status;
        if (tip) ride.tip = tip;
        if (paymentStatus) ride.paymentStatus = paymentStatus;

        await ride.save();

        logger.info('Ride updated successfully', { rideId: ride._id, status, paymentStatus, userId: req.user?.id });
        res.status(200).json(ride);
    } catch (err) {
        logger.error('Error updating ride', { error: err.message, rideId: req.params.id, userId: req.user?.id });
        res.status(500).json({ message: err.message });
    }
};

function getOtp(num) {
    function generateOtp(num) {
        const otp = Math.floor(
            Math.pow(10, num - 1) + Math.random() * (Math.pow(10, num) - Math.pow(10, num - 1))
        );
        return otp;
    }
    return generateOtp(num).toString();
}
