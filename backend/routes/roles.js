const express = require('express');
const router = express.Router();
const verifyAccess = require('../middleware/verification_black_box');
const Role = require('../models/role');

// Create role
router.post('/create', verifyAccess('create:role'), async (req, res) => {
    try {
        const { role, permissions, enabled } = req.body;
        const newRole = new Role({ role, permissions, enabled });
        await newRole.save();
        res.status(201).json({ message: 'Role created successfully', role: newRole });
    } catch (error) {
        res.status(500).json({ message: 'Error creating role', error });
    }
});

// Get role by ID
router.get('/:id', verifyAccess('read:role'), async (req, res) => {
    try {
        const role = await Role.findById(req.params.id).populate('permissions');
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching role', error });
    }
});

// Update role
router.put('/:id', verifyAccess('update:role'), async (req, res) => {
    try {
        const { role, permissions, enabled } = req.body;
        const updatedRole = await Role.findByIdAndUpdate(req.params.id, { role, permissions, enabled }, { new: true });
        if (!updatedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json({ message: 'Role updated successfully', role: updatedRole });
    } catch (error) {
        res.status(500).json({ message: 'Error updating role', error });
    }
});

// Delete role
router.delete('/:id', verifyAccess('delete:role'), async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);
        if (!deletedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting role', error });
    }
});

// Get all roles
router.get('/', verifyAccess('read:role'), async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching roles', error });
    }
});

module.exports = router;