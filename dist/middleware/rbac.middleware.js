"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUser = exports.requireBuilder = exports.requireSalesManager = exports.requireAdmin = void 0;
exports.requireRole = requireRole;
const response_1 = require("../utils/response");
const auth_middleware_1 = require("./auth.middleware");
function requireRole(...roles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            (0, response_1.sendUnauthorized)(res, 'Authentication required');
            return;
        }
        const currentRole = (0, auth_middleware_1.normalizeRole)(user.role || user.accountType);
        // Super Admin has total platform administrative privileges
        if (currentRole === 'SUPER_ADMIN' || user.role === 'super_admin') {
            next();
            return;
        }
        const targetRoles = roles.map(auth_middleware_1.normalizeRole);
        if (!targetRoles.includes(currentRole) && !roles.includes(user.role || '')) {
            (0, response_1.sendForbidden)(res, `Access denied. Required enterprise role: ${roles.join(' or ')}`);
            return;
        }
        next();
    };
}
// Enterprise operational shortcuts
exports.requireAdmin = requireRole('ADMIN', 'SUPER_ADMIN', 'admin');
exports.requireSalesManager = requireRole('SALES_MANAGER', 'ADMIN', 'SUPER_ADMIN');
exports.requireBuilder = requireRole('BUILDER', 'ADMIN', 'SUPER_ADMIN');
const requireUser = (req, res, next) => next(); // All authenticated users
exports.requireUser = requireUser;
//# sourceMappingURL=rbac.middleware.js.map