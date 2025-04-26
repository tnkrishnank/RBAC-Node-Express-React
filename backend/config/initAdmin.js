const Role = require('../models/role');
const User = require('../models/user');
const Permission = require('../models/permission');

const initAdmin = async () => {
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
        console.log('Admin user exists');
        return;
    }
    // Define default permissions
    const permissionsList = [
        'create:user', 'read:user', 'update:user', 'delete:user', 'readme:user',
        'create:role', 'read:role', 'update:role', 'delete:role',
        'create:permission', 'read:permission', 'update:permission', 'delete:permission',
        'create:post', 'read:post', 'update:post', 'delete:post'
    ];
    // Create and store permissions if they don't exist
    const permissions = [];
    for (const perm of permissionsList) {
        let p = await Permission.findOne({ permission: perm });
        if (!p) {
            p = new Permission({ permission: perm });
            await p.save();
        }
        permissions.push(p._id);
    }
    // Create admin role
    const adminRole = new Role({
        role: 'admin',
        permissions
    });
    await adminRole.save();
    // Create admin user
    const adminUser = new User({
        username: 'admin',
        password: 'admin123',
        email: 'admin@admin.com',
        name: 'Admin',
        enabled: true,
        roles: [adminRole._id],
        secured: true
    });
    await adminUser.save();
    // Get permissions to create default user role
    const readPostPermission = await Permission.findOne({ permission: 'read:post' });
    const readUserPermission = await Permission.findOne({ permission: 'readme:user' });
    // Create user role with limited permissions
    let existingUserRole = await Role.findOne({ role: 'user' });
    if (!existingUserRole) {
        existingUserRole = new Role({
            role: 'user',
            permissions: [readPostPermission._id, readUserPermission._id]
        });
        await existingUserRole.save();
    }
    console.log('Default admin user created (username: admin, password: admin123)');
};

module.exports = initAdmin;