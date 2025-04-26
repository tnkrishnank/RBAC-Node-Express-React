const mongoose = require('mongoose');
const initAdmin = require('./initAdmin');

// Method to connect to MongoDB
const connectDB = async () => {
    try {
        // Connect to the MongoDB database using the URI from the .env file
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
        await initAdmin();
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;