const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/user.model');

// Load env vars explicitly from the parent directory if running from src
// or just standard config if running from root.
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('Checking environment...');
console.log('Current directory:', process.cwd());
console.log('MONGO_URI Present:', !!process.env.MONGO_URI);

const run = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is undefined in .env');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully.');

        const email = 'test@example.com';
        const password = 'password123';

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('Test user already exists.');
            // Update password to be sure
            user.password = password;
            await user.save();
            console.log('Test user password updated to "password123".');
        } else {
            // Create test user
            user = await User.create({
                name: 'Test User',
                email,
                password, // model pre-save will hash this
                role: 'user'
            });
            console.log('Test User Created.');
        }

        console.log('--- LOGIN DETAILS ---');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('---------------------');

        process.exit(0);
    } catch (err) {
        console.error('Fatal Error:', err.message);
        process.exit(1);
    }
};

run();
