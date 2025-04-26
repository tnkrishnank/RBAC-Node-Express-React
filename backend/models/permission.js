const mongoose = require('mongoose');
const { getRBACDB } = require('../config/dbSelector');
const rbacDB = getRBACDB;

// Schema for Permission model
const permissionSchema = new mongoose.Schema({
    permission: {
        type: String,
        required: true,
        unique: true,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
});

const Permission = rbacDB.model('Permission', permissionSchema);
module.exports = Permission;