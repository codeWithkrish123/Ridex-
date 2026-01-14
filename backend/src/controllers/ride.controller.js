const Ride = require('../models/ride.model');
const { validationResult } = require('express-validator');

// @desc    Create a new ride
// @route   POST /api/rides/create
// @access  Private (User)
exports.createRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { pickup, destination, vehicleType, fare } = req.body;

        const newRide = await Ride.create({
            user: req.user.id,
            pickup,
            destination,
            vehicleType,
            fare,
            otp: getOtp(4),
        });

        res.status(201).json(newRide);
    } catch (err) {
        return res.status(500).json({ message: err.message });
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
