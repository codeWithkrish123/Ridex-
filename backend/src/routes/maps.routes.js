const express = require('express');
const router = express.Router();
const mapsController = require('../controllers/maps.controller');

// Google Maps API proxy endpoints
router.get('/geocode', mapsController.geocode);
router.get('/directions', mapsController.directions);
router.get('/places', mapsController.places);
router.get('/config', mapsController.config);

module.exports = router;
