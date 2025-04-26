const express = require('express');
const router = express.Router();
const verifyAccess = require('../middleware/verification_black_box');
const User = require('../models/user');
const { isValidPassword } = require('../utils/passwordValidator');

// Create user
router.post('/create', verifyAccess('create:user'), async (req, res) => {
    try {
        const { username, password, email, name, enabled, roles, secured } = req.body;
        if (!isValidPassword(password)) {
            return res.status(400).json({ message: 'Password should contain atleast one uppercase, one lowercase, one number and one special characters and a minimum length of 8.' });
        }
        const newUser = new User({ username, password, email, name, enabled, roles, secured });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});

// Get user by ID
router.get('/:id', verifyAccess('read:user'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('roles');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

// Update user
router.put('/:id', verifyAccess('update:user'), async (req, res) => {
    try {
        const { username, password, email, name, enabled, roles, secured } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { username, password, email, name, enabled, roles, secured }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
});

// Delete user
router.delete('/:id', verifyAccess('delete:user'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.secured) {
            return res.status(403).json({ message: 'Cannot delete a secured user' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

// Get all users
router.get('/', verifyAccess('read:user'), async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('roles');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

module.exports = router;