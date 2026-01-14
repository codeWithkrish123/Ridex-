const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { createRide } = require('../controllers/ride.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/create',
    protect,
    [
        body('pickup.address').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
        body('pickup.lat').isNumeric().withMessage('Invalid pickup latitude'),
        body('pickup.lng').isNumeric().withMessage('Invalid pickup longitude'),
        body('destination.address').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
        body('destination.lat').isNumeric().withMessage('Invalid destination latitude'),
        body('destination.lng').isNumeric().withMessage('Invalid destination longitude'),
        body('vehicleType').isIn(['auto', 'car', 'moto']).withMessage('Invalid vehicle type'),
        body('fare').isNumeric().withMessage('Invalid fare')
    ],
    createRide
);

module.exports = router;
