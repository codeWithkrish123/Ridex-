const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const rideController = require('../controllers/ride.controller');
const { createRide } = require('../controllers/ride.controller'); // keeping for existing ref if needed, or better to switch to rideController.createRide
const { protect } = require('../middlewares/auth.middleware');

router.post('/create',
    protect,
    [
        body('pickup.address').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
        body('pickup.lat').optional().isNumeric().withMessage('Invalid pickup latitude'),
        body('pickup.lng').optional().isNumeric().withMessage('Invalid pickup longitude'),
        body('destination.address').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
        body('destination.lat').optional().isNumeric().withMessage('Invalid destination latitude'),
        body('destination.lng').optional().isNumeric().withMessage('Invalid destination longitude'),
        body('vehicleType').isIn(['auto', 'car', 'moto', 'RideX Go', 'RideX Comfort', 'RideX Black', 'RideX XL', 'economy', 'comfort', 'premium', 'xl']).withMessage('Invalid vehicle type'),
        body('fare').isNumeric().withMessage('Invalid fare'),
        body('tip').optional().isNumeric().withMessage('Invalid tip amount')
    ],
    createRide
);

router.put('/:id', protect, rideController.updateRide);

router.get('/user-rides', protect, rideController.getUserRides);

module.exports = router;
