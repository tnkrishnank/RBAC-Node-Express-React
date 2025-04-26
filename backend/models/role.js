const mongoose = require('mongoose');
const { getRBACDB } = require('../config/dbSelector');
const rbacDB = getRBACDB;

// Schema for Role model
const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission', // Reference to Permission model
    }],
    enabled: {
        type: Boolean,
        default: true,
    },
});

const Role = rbacDB.model('Role', roleSchema);
module.exports = Role;