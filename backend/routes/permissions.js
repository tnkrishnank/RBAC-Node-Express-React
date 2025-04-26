const express = require('express');
const router = express.Router();
const verifyAccess = require('../middleware/verification_black_box');
const Permission = require('../models/permission');

// Create permission
router.post('/create', verifyAccess('create:permission'), async (req, res) => {
    try {
        const { permission, enabled } = req.body;
        const newPermission = new Permission({ permission, enabled });
        await newPermission.save();
        res.status(201).json({ message: 'Permission created successfully', permission: newPermission });
    } catch (error) {
        res.status(500).json({ message: 'Error creating permission', error });
    }
});

// Get permission by ID
router.get('/:id', verifyAccess('read:permission'), async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        res.status(200).json(permission);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permission', error });
    }
});

// Update permission
router.put('/:id', verifyAccess('update:permission'), async (req, res) => {
    try {
        const { permission, enabled } = req.body;
        const updatedPermission = await Permission.findByIdAndUpdate(req.params.id, { permission, enabled }, { new: true });
        if (!updatedPermission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        res.status(200).json({ message: 'Permission updated successfully', permission: updatedPermission });
    } catch (error) {
        res.status(500).json({ message: 'Error updating permission', error });
    }
});

// Delete permission
router.delete('/:id', verifyAccess('delete:permission'), async (req, res) => {
    try {
        const deletedPermission = await Permission.findByIdAndDelete(req.params.id);
        if (!deletedPermission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        res.status(200).json({ message: 'Permission deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting permission', error });
    }
});

// Get all permissions
router.get('/', verifyAccess('read:permission'), async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permissions', error });
    }
});

module.exports = router;