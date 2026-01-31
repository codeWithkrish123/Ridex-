const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Check if user exists
        const userExists = await User.findOne({ email: 'test@example.com' });
        if (userExists) {
            console.log('Test user already exists');
            process.exit();
        }

        // Create test user
        // Note: Password will be hashed by the pre-save hook in user.model.js
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'user'
        });

        console.log('Test User Created:');
        console.log('Email: test@example.com');
        console.log('Password: password123');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();
