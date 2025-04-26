const express = require('express');
const router = express.Router();
const verifyAccess = require('../middleware/verification_black_box');
const User = require('../models/user');
const Role = require('../models/role');
const jwt = require('jsonwebtoken');

// Method to generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '1h'}
    );
};

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password, name, email } = req.body;
    try {
        // Check if user already exists by username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        // Create a new user
        const defaultRole = await Role.findOne({ role: 'user' });
        if (!defaultRole) {
            return res.status(500).json({ message: 'Default role not found' });
        }
        const newUser = new User({ username, password, name, email, roles: roles || [defaultRole._id] });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Compare the entered password with the stored password hash
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Update login date
        user.login_dt = new Date();
        await user.save();
        // Generate a JWT token for the user
        const token = generateToken(user._id);
        // Send the token in response
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user details
router.get('/me', verifyAccess('readme:user'), async (req, res) => {
    try {
        // User populated by verifyAccess
        const user = req.user;
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;