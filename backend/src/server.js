const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// add a health check of server
app.get('/api/health', (req, res) => {
    res.json({ message: "Server is running" });
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
