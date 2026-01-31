const { io } = require('socket.io-client');

const socket = io('http://localhost:5000');

const rideId = 'test-ride-123';

socket.on('connect', () => {
    console.log('Driver connected with ID:', socket.id);
    socket.emit('joinRide', rideId);

    let lat = 40.7128;
    let lng = -74.0060;

    // Send location every 2 seconds
    setInterval(() => {
        lat += 0.001; // Move driver
        lng += 0.001;
        console.log(`Sending location: ${lat}, ${lng}`);
        socket.emit('driverLocation', {
            rideId,
            location: { lat, lng }
        });
    }, 2000);
});

socket.on('disconnect', () => {
    console.log('Driver disconnected');
});
