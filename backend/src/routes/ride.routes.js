const express = require('express');
const { check } = require('express-validator');

const {
  requestRide,
  getRide,
  getMyRides,
  completeRide,
} = require('../controllers/ride.controller');

const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(protect);

const rideValidators = [
  check('pickupLocation.latitude').isNumeric(),
  check('pickupLocation.longitude').isNumeric(),
  check('pickupLocation.address').notEmpty(),
  check('dropoffLocation.latitude').isNumeric(),
  check('dropoffLocation.longitude').isNumeric(),
  check('dropoffLocation.address').notEmpty(),
  check('distance').isNumeric(),
  check('estimatedDuration').isNumeric(),
];

router.post(
  '/',
  ...rideValidators,
  validate,
  requestRide
);

router.get('/:id', getRide);
router.get('/', getMyRides);
router.put('/:id/complete', completeRide);

module.exports = router;