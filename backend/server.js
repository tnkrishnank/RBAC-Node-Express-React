const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Initialize dotenv to load environment variables
dotenv.config();

// Create an instance of Express
const app = express();

// Middleware to parse JSON data from request bodies
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Connect to the database
connectDB();

const authenticationRoutes = require('./routes/authentication');
const permissionRoutes = require('./routes/permissions');
const postRoutes = require('./routes/posts');
const roleRoutes = require('./routes/roles');
const userRoutes = require('./routes/users');

// Define routes
app.use('/api/authentication', authenticationRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);

// Catch-all for invalid routes (404)
app.use(/.*/, (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// General error handling for 500 errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Set the port to 5000 (or use the one from environment variables)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});