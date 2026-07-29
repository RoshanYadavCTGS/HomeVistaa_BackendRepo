"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.refresh = refresh;
exports.me = me;
exports.changePassword = changePassword;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.updateProfile = updateProfile;
exports.getDashboardSummary = getDashboardSummary;
exports.uploadAvatar = uploadAvatar;
exports.getUserNotifications = getUserNotifications;
exports.getSystemActivityLogs = getSystemActivityLogs;
const authService = __importStar(require("../services/auth.service"));
const userRepo = __importStar(require("../repositories/user.repository"));
const notificationService = __importStar(require("../services/notification.service"));
const activityLogService = __importStar(require("../services/activityLog.service"));
const response_1 = require("../utils/response");
const constants_1 = require("../constants");
const email_service_1 = require("../services/email.service");
const env_1 = require("../config/env");
function getReqContext(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]) || req.ip || req.socket.remoteAddress || '127.0.0.1';
    return { ip, userAgent: req.headers['user-agent'] };
}
async function register(req, res, next) {
    try {
        const { user, accessToken, refreshToken } = await authService.register(req.body, getReqContext(req));
        const cookieOpts = { ...constants_1.COOKIE_OPTIONS, maxAge: (req.body.rememberMe ? 30 : 7) * 24 * 3600 * 1000 };
        res.cookie(constants_1.TOKEN_COOKIE_NAME, refreshToken, cookieOpts);
        (0, email_service_1.sendWelcomeEmail)(user.name, user.email).catch(() => { });
        (0, response_1.sendCreated)(res, { user, accessToken }, 'Account profile registered successfully');
    }
    catch (err) {
        next(err);
    }
}
async function login(req, res, next) {
    try {
        const { user, accessToken, refreshToken } = await authService.login(req.body, getReqContext(req));
        const cookieOpts = { ...constants_1.COOKIE_OPTIONS, maxAge: (req.body.rememberMe ? 30 : 7) * 24 * 3600 * 1000 };
        res.cookie(constants_1.TOKEN_COOKIE_NAME, refreshToken, cookieOpts);
        (0, response_1.sendSuccess)(res, { user, accessToken }, 'Authentication successful');
    }
    catch (err) {
        next(err);
    }
}
async function logout(req, res, next) {
    try {
        const refreshToken = req.cookies?.[constants_1.TOKEN_COOKIE_NAME] ?? req.body?.refreshToken;
        if (refreshToken) {
            await authService.logout(refreshToken, getReqContext(req));
        }
        res.clearCookie(constants_1.TOKEN_COOKIE_NAME, { path: '/' });
        (0, response_1.sendNoContent)(res);
    }
    catch (err) {
        next(err);
    }
}
async function refresh(req, res, next) {
    try {
        const refreshToken = req.cookies?.[constants_1.TOKEN_COOKIE_NAME] ?? req.body?.refreshToken;
        if (!refreshToken) {
            (0, response_1.sendBadRequest)(res, 'Refresh token is required');
            return;
        }
        const { accessToken } = await authService.refreshAccessToken(refreshToken);
        (0, response_1.sendSuccess)(res, { accessToken }, 'Access token refreshed');
    }
    catch (err) {
        next(err);
    }
}
async function me(req, res, next) {
    try {
        const { userId } = req.user;
        const user = await userRepo.findUserById(userId);
        if (!user) {
            (0, response_1.sendNotFound)(res, 'User profile not found');
            return;
        }
        (0, response_1.sendSuccess)(res, { user }, 'Profile retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function changePassword(req, res, next) {
    try {
        const { userId } = req.user;
        await authService.changePassword(userId, req.body, getReqContext(req));
        res.clearCookie(constants_1.TOKEN_COOKIE_NAME, { path: '/' });
        (0, response_1.sendSuccess)(res, null, 'Password updated. Please sign in again.');
    }
    catch (err) {
        next(err);
    }
}
async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body;
        const rawToken = await authService.generatePasswordResetToken(email, getReqContext(req));
        const resetUrl = `${env_1.env.CORS_ORIGINS[0] || 'http://localhost:3000'}/reset-password?token=${rawToken}`;
        (0, email_service_1.sendPasswordResetEmail)(email, resetUrl).catch(() => { });
        (0, response_1.sendSuccess)(res, null, 'If an account exists for this email, a password recovery link has been sent.');
    }
    catch (err) {
        next(err);
    }
}
async function resetPassword(req, res, next) {
    try {
        const { token, newPassword } = req.body;
        await authService.resetPassword(token, newPassword, getReqContext(req));
        (0, response_1.sendSuccess)(res, null, 'Password successfully reset. You may now log in.');
    }
    catch (err) {
        next(err);
    }
}
async function updateProfile(req, res, next) {
    try {
        const { userId } = req.user;
        const { name, phone, avatarUrl, dob, city, pinCode, preferredLanguages, propertyPreferences, employmentDetails, accountType, addressDetails, securitySettings, notificationPrefs, documents } = req.body;
        let parsedDob;
        if (dob)
            parsedDob = new Date(dob);
        const updated = await userRepo.updateUser(userId, {
            name, phone, avatarUrl,
            ...(parsedDob && { dob: parsedDob }),
            ...(city !== undefined && { city }),
            ...(pinCode !== undefined && { pinCode }),
            ...(preferredLanguages && { preferredLanguages }),
            ...(propertyPreferences !== undefined && { propertyPreferences }),
            ...(employmentDetails !== undefined && { employmentDetails }),
            ...(accountType !== undefined && { accountType }),
            ...(addressDetails !== undefined && { addressDetails }),
            ...(securitySettings !== undefined && { securitySettings }),
            ...(notificationPrefs !== undefined && { notificationPrefs }),
            ...(documents !== undefined && { documents }),
        });
        await activityLogService.logActivity({
            userId,
            action: 'PROFILE_UPDATED',
            metadata: { fieldsUpdated: Object.keys(req.body) },
            ...getReqContext(req),
        });
        (0, response_1.sendSuccess)(res, { user: updated }, 'Profile updated successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getDashboardSummary(req, res, next) {
    try {
        const { userId } = req.user;
        const stats = await userRepo.getUserStats(userId);
        (0, response_1.sendSuccess)(res, stats, 'Dashboard operational metrics retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function uploadAvatar(req, res, next) {
    try {
        if (!req.file) {
            (0, response_1.sendBadRequest)(res, 'No avatar file attached');
            return;
        }
        const { userId } = req.user;
        const protocol = req.protocol;
        const host = req.get('host');
        const url = `${protocol}://${host}/${env_1.env.UPLOAD_DIR}/${req.file.filename}`;
        const updatedUser = await userRepo.updateUser(userId, { avatarUrl: url });
        (0, response_1.sendSuccess)(res, { user: updatedUser, url }, 'Avatar uploaded');
    }
    catch (err) {
        next(err);
    }
}
async function getUserNotifications(req, res, next) {
    try {
        const { userId } = req.user;
        const notifications = await notificationService.getAllNotifications(userId);
        (0, response_1.sendSuccess)(res, { notifications }, 'Notifications fetched');
    }
    catch (err) {
        next(err);
    }
}
async function getSystemActivityLogs(req, res, next) {
    try {
        const logs = await activityLogService.getActivityLogs(100);
        (0, response_1.sendSuccess)(res, { logs }, 'Activity logs fetched');
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auth.controller.js.map