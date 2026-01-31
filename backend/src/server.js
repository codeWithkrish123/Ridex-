const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:8080'],
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on('joinRide', (rideId) => {
        socket.join(rideId);
        console.log(`User ${socket.id} joined ride: ${rideId}`);
    });

    socket.on('driverLocation', (data) => {
        const { rideId, location } = data;
        io.to(rideId).emit('driverLocation', location);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// add a health check of server
app.get('/api/health', (req, res) => {
    res.json({ message: "Server is running" });
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
