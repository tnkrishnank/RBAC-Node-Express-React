const mongoose = require('mongoose');
const { getRBACDB } = require('../config/dbSelector');
const rbacDB = getRBACDB;
const bcrypt = require('bcryptjs');

// Schema for User model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        default: null,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role', // Reference to Role model
    }],
    creation_dt: {
        type: Date,
        default: Date.now,
    },
    login_dt: {
        type: Date,
        default: null,
    },
    secured: {
        type: Boolean,
        default: false,
    },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = rbacDB.model('User', userSchema);
module.exports = User;