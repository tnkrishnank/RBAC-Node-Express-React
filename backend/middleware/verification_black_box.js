const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyAccess = (requiredPermission) => {
    return async (req, res, next) => {
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
                match: { enabled: true },
                populate: {
                    path: 'permissions',
                    match: { enabled: true },
                }
            });
            if (!user || !user.enabled) {
                return res.status(403).json({ message: 'User not authorized' });
            }
            // Check if user has the required permission through roles
            const hasPermission = user.roles.some(role =>
                role.permissions.some(permission => permission.permission === requiredPermission)
            );
            if (!hasPermission) {
                return res.status(403).json({ message: 'Permission denied' });
            }
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token is invalid or expired', error });
        }
    };
};

module.exports = verifyAccess;