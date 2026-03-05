const { io } = require('socket.io-client');

// Validate environment variables
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const RIDE_ID = process.env.RIDE_ID || 'test-ride-123';
const UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL) || 2000;

// Validate ride ID format
function validateRideId(rideId) {
  if (!rideId || typeof rideId !== 'string') {
    throw new Error('Invalid ride ID: must be a non-empty string');
  }
  if (rideId.length < 3 || rideId.length > 50) {
    throw new Error('Invalid ride ID: must be between 3 and 50 characters');
  }
  return rideId;
}

// Validate coordinates
function validateCoordinates(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new Error('Coordinates must be numbers');
  }
  if (lat < -90 || lat > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  if (lng < -180 || lng > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }
  return { lat, lng };
}

const socket = io(BACKEND_URL);

let rideId;
try {
  rideId = validateRideId(RIDE_ID);
} catch (error) {
  console.error('Configuration error:', error.message);
  process.exit(1);
}

socket.on('connect', () => {
    console.log('Driver connected with ID:', socket.id);
    socket.emit('joinRide', rideId);

    // Starting location (New York City)
    let lat = 40.7128;
    let lng = -74.0060;

    // Send location every 2 seconds
    setInterval(() => {
      try {
        // Simulate driver movement
        lat += 0.001;
        lng += 0.001;
        
        // Validate coordinates before sending
        const location = validateCoordinates(lat, lng);
        
        console.log(`Sending location: ${location.lat}, ${location.lng}`);
        socket.emit('driverLocation', {
            rideId,
            location: location
        });
      } catch (error) {
        console.error('Location validation error:', error.message);
        // Reset to valid coordinates if validation fails
        lat = 40.7128;
        lng = -74.0060;
      }
    }, UPDATE_INTERVAL);
});

socket.on('disconnect', () => {
    console.log('Driver disconnected');
});

// Handle connection errors
socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
});

// Handle server errors
socket.on('error', (error) => {
    console.error('Socket error:', error.message);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down driver simulation...');
    socket.disconnect();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Shutting down driver simulation...');
    socket.disconnect();
    process.exit(0);
});
