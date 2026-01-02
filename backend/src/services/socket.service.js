// src/services/socket.service.js
const logger = require('../utils/logger');

let io;

const initialize = (socketIo) => {
  io = socketIo;

  io.on('connection', (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    // Join driver room
    socket.on('driver_online', (driverId) => {
      socket.join(`driver_${driverId}`);
      logger.info(`Driver ${driverId} is now online`);
    });

    // Handle ride request
    socket.on('request_ride', (rideData) => {
      // In a real app, we would find nearby drivers and emit to them
      // For now, we'll just log it
      logger.info(`New ride requested: ${JSON.stringify(rideData)}`);
      // Broadcast to all drivers (in a real app, filter by location)
      io.emit('new_ride_request', rideData);
    });

    // Handle location updates
    socket.on('location_update', (data) => {
      const { rideId, location } = data;
      // Broadcast to the specific ride room
      io.to(`ride_${rideId}`).emit('driver_location', location);
    });

    // Handle ride acceptance
    socket.on('accept_ride', (data) => {
      const { rideId, driverId } = data;
      // Join the ride room
      socket.join(`ride_${rideId}`);
      io.to(`ride_${rideId}`).emit('ride_accepted', { driverId });
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = {
  initialize,
  getIO: () => io,
};