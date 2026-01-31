const mongoose = require('mongoose');
const Ride = require('./models/ride.model');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ridex'; // Fallback if env not loaded

async function testRideCreation() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Create a dummy ride with the new fields
        const rideData = {
            user: new mongoose.Types.ObjectId(), // Fake user ID
            pickup: { address: '123 Main St', lat: 40.7128, lng: -74.0060 },
            destination: { address: '456 Elm St', lat: 40.7306, lng: -73.9352 },
            vehicleType: 'RideX Comfort',
            capacity: 4,
            fare: 25.50,
            tip: 5.00
        };

        const ride = await Ride.create(rideData);
        console.log('Ride created successfully:');
        console.log(JSON.stringify(ride, null, 2));

        if (ride.vehicleType === 'RideX Comfort' && ride.capacity === 4) {
            console.log('VERIFICATION PASSED: vehicleType and capacity saved correctly.');
        } else {
            console.error('VERIFICATION FAILED: Fields mismatch.');
        }

        // Clean up
        await Ride.findByIdAndDelete(ride._id);
        console.log('Test ride cleaned up.');

    } catch (error) {
        console.error('Error creating ride:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testRideCreation();
