const express = require('express');
const router = express.Router();
const verifyAccess = require('../middleware/verification_black_box');
const User = require('../models/user');
const Role = require('../models/role');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/mailer');

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
        // Create email verification link
        const signupData = { username, password, name, email };
        const token = jwt.sign(signupData, process.env.EMAIL_VERIFICATION_SECRET, { expiresIn: '10m' });
        const verificationLink = `${process.env.BASE_URL}/api/authentication/verify-email?token=${token}`;
        // Send email
        try {
            await sendVerificationEmail(email, verificationLink);
            res.status(200).json({ message: 'Verification email sent! Please check your inbox.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to send verification email' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify email
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send('Invalid or missing token');
    }
    try {
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
        // Check if email already exists
        const existingUser = await User.findOne({ email: decoded.email });
        if (existingUser) {
            return res.status(400).send('Email already verified');
        }
        // Create a new user
        const defaultRole = await Role.findOne({ role: 'user' });
        if (!defaultRole) {
            return res.status(500).json({ message: 'Default role not found' });
        }
        const newUser = new User({
            username: decoded.username,
            password: decoded.password,
            name: decoded.name,
            email: decoded.email,
            roles: [defaultRole._id]
        });
        await newUser.save();
        res.status(201).json({ message: 'Your email is verified and User registered successfully' });
    } catch (error) {
        res.status(400).send('Token expired or invalid');
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

// Admin login
router.post('/admin-login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user by username
        const user = await User.findOne({ username }).populate({
            path: 'roles',
            match: { enabled: true }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check if user has admin role
        const hasRole = user.roles.some(role => role.role === "admin");
        if (!hasRole) {
            return res.status(403).json({ message: 'You are not authorized to log in as an admin' });
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

// Verify admin
router.post('/verify-admin', async (req, res) => {
    // Check if Bearer token is available
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }
    const token = authHeader.split(' ')[1];
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password').populate({
            path: 'roles',
            match: { enabled: true }
        });
        if (!user || !user.enabled) {
            return res.status(403).json({ message: 'User not authorized' });
        }
        // Check if user has admin role
        const hasRole = user.roles.some(role => role.role === "admin");
        if (!hasRole) {
            return res.status(403).json({ message: 'You are not authorized to log in as an admin' });
        }
        res.status(200).json({ message: 'Admin verification successful', token });
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