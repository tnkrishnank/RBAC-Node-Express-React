const mongoose = require('mongoose');

// Defining selectors for multiple databases
const getRBACDB = mongoose.connection.useDb('rbac_platform');
const getResourcesDB = mongoose.connection.useDb('resources');

module.exports = {
    getRBACDB,
    getResourcesDB,
};