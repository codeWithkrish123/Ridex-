// At the very top of server.js
require('dotenv').config();
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const app = require('./app');
const socketService = require('./services/socket.service');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
// In server.js, update the connectDB function:

//check health Ping


const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Remove useNewUrlParser and useUnifiedTopology as they are not needed in newer versions
      // Add serverSelectionTimeoutMS for better error handling
      serverSelectionTimeoutMS: 5000,
    });
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`, { 
      service: 'database' 
    });
  } catch (err) {
    logger.error(`Database connection error: ${err.message}`, { 
      service: 'database',
      error: err.message // Only log the error message to avoid circular references
    });
    process.exit(1);
  }
};

// Connect to the database before starting the server
connectDB();

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  },
});

socketService.initialize(io);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`, { service: 'server' });
  // Close server & exit process
  server.close(() => process.exit(1));
});

server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`, {
    service: 'server'
  });
});