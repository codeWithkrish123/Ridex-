const axios = require('axios');

// Get Google Maps API key from environment
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.warn('Google Maps API key not configured in environment');
}

// Proxy endpoint for Google Maps Geocoding API
exports.geocode = async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address,
          key: GOOGLE_MAPS_API_KEY
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Geocoding error:', error.message);
    res.status(500).json({ error: 'Failed to geocode address' });
  }
};

// Proxy endpoint for Google Maps Directions API
exports.directions = async (req, res) => {
  try {
    const { origin, destination, mode = 'driving' } = req.query;
    
    if (!origin || !destination) {
      return res.status(400).json({ 
        error: 'Origin and destination parameters are required' 
      });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin,
          destination,
          mode,
          key: GOOGLE_MAPS_API_KEY
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Directions error:', error.message);
    res.status(500).json({ error: 'Failed to get directions' });
  }
};

// Proxy endpoint for Google Maps Places API
exports.places = async (req, res) => {
  try {
    const { input, type = 'address' } = req.query;
    
    if (!input) {
      return res.status(400).json({ 
        error: 'Input parameter is required' 
      });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      {
        params: {
          input,
          types: type,
          key: GOOGLE_MAPS_API_KEY
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Places autocomplete error:', error.message);
    res.status(500).json({ error: 'Failed to get place suggestions' });
  }
};

// Config endpoint to provide API key to frontend
exports.config = async (req, res) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }
    
    res.json({ apiKey: GOOGLE_MAPS_API_KEY });
  } catch (error) {
    console.error('Config error:', error.message);
    res.status(500).json({ error: 'Failed to get configuration' });
  }
};
