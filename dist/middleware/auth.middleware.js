"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.optionalAuthenticate = optionalAuthenticate;
exports.normalizeRole = normalizeRole;
exports.authorize = authorize;
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        (0, response_1.sendUnauthorized)(res, 'Authentication token is missing');
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        (0, response_1.sendUnauthorized)(res, 'Authentication token is invalid');
        return;
    }
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch (err) {
        if (err instanceof Error && err.name === 'TokenExpiredError') {
            (0, response_1.sendUnauthorized)(res, 'Token has expired. Please refresh your session.');
        }
        else {
            (0, response_1.sendUnauthorized)(res, 'Invalid authentication token');
        }
    }
}
// Optional auth — attaches user if token present, continues without error if not
function optionalAuthenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token) {
            try {
                const payload = (0, jwt_1.verifyAccessToken)(token);
                req.user = payload;
            }
            catch {
                // Ignore invalid token in optional auth
            }
        }
    }
    next();
}
// Helper to normalize enterprise roles and maintain backward compatibility
function normalizeRole(role) {
    if (!role)
        return 'CUSTOMER';
    const r = role.toUpperCase().replace(/\s+/g, '_');
    if (r === 'USER' || r === 'TENANT' || r === 'OWNER')
        return 'CUSTOMER';
    if (r === 'RELATIONSHIP_MANAGER' || r === 'SALES_MANAGER' || r === 'SALES')
        return 'SALES_MANAGER';
    return r;
}
/**
 * Reusable permission and role-based authorization middleware
 * Example: authenticate, authorize(['SUPER_ADMIN', 'ADMIN'], ['property:approve'])
 */
function authorize(allowedRoles, requiredPermissions) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            (0, response_1.sendUnauthorized)(res, 'Authentication required before authorization');
            return;
        }
        const currentRole = normalizeRole(user.role || user.accountType);
        const targetRoles = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]).map(normalizeRole);
        // Super Admin has unrestricted enterprise platform access
        if (currentRole === 'SUPER_ADMIN') {
            next();
            return;
        }
        // Check enterprise role match
        if (targetRoles.length > 0 && !targetRoles.includes(currentRole)) {
            (0, response_1.sendForbidden)(res, `Access denied. Your role (${currentRole}) requires one of: ${targetRoles.join(', ')}`);
            return;
        }
        // Check granular RBAC permissions if requested
        if (requiredPermissions && requiredPermissions.length > 0) {
            const userPermissions = user.permissions || [];
            const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));
            if (!hasPermission) {
                (0, response_1.sendForbidden)(res, `Access denied. Missing required permissions: ${requiredPermissions.join(', ')}`);
                return;
            }
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map