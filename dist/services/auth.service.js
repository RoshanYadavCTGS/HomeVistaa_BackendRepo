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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.refreshAccessToken = refreshAccessToken;
exports.changePassword = changePassword;
exports.generatePasswordResetToken = generatePasswordResetToken;
exports.resetPassword = resetPassword;
const userRepo = __importStar(require("../repositories/user.repository"));
const jwtUtil = __importStar(require("../utils/jwt"));
const bcrypt_1 = require("../utils/bcrypt");
const error_middleware_1 = require("../middleware/error.middleware");
const constants_1 = require("../constants");
const crypto_1 = __importDefault(require("crypto"));
const database_1 = __importDefault(require("../config/database"));
const activityLog_service_1 = require("./activityLog.service");
const notification_service_1 = require("./notification.service");
async function register(input, ctx) {
    const existing = await userRepo.findUserByEmail(input.email);
    if (existing) {
        throw (0, error_middleware_1.createError)('An account with this email address already exists.', constants_1.HTTP_STATUS.CONFLICT);
    }
    const passwordHash = await (0, bcrypt_1.hashPassword)(input.password);
    // Determine role mapping
    let targetRole = 'user';
    let targetAccountType = 'customer';
    if (input.role) {
        const norm = input.role.toLowerCase().replace(/\s+/g, '_');
        if (['admin', 'super_admin'].includes(norm))
            targetRole = 'admin';
        targetAccountType = norm;
    }
    const user = await userRepo.createUser({
        name: input.name,
        email: input.email,
        passwordHash,
        role: targetRole,
        accountType: targetAccountType,
    });
    const tokenPayload = { userId: user.id, email: user.email, role: user.role, accountType: user.accountType || targetAccountType };
    const accessToken = jwtUtil.generateAccessToken(tokenPayload);
    const refreshToken = jwtUtil.generateRefreshToken(tokenPayload);
    const tokenHash = await (0, bcrypt_1.hashToken)(refreshToken);
    const days = input.rememberMe ? 30 : 7;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const { browser, device } = (0, activityLog_service_1.parseUserAgent)(ctx?.userAgent);
    await userRepo.storeRefreshToken(user.id, tokenHash, expiresAt, {
        rememberMe: input.rememberMe,
        device,
        browser,
        ipAddress: ctx?.ip || 'Unknown',
    });
    await (0, activityLog_service_1.logActivity)({
        userId: user.id,
        action: 'REGISTER',
        entityType: 'user',
        entityId: user.id,
        metadata: { accountType: user.accountType },
        ipAddress: ctx?.ip,
        browser,
        device,
    });
    await (0, notification_service_1.createNotification)({
        userId: user.id,
        title: 'Welcome to HomeVistaa!',
        message: 'Your account has been successfully created with secure Email & Password authentication.',
        type: 'account_created',
    });
    return { user, accessToken, refreshToken };
}
async function login(input, ctx) {
    const user = await userRepo.findUserByEmail(input.email);
    if (!user) {
        throw (0, error_middleware_1.createError)('Invalid email address or password.', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const isPasswordValid = await (0, bcrypt_1.comparePassword)(input.password, user.passwordHash);
    if (!isPasswordValid) {
        await (0, activityLog_service_1.logActivity)({
            userId: user.id,
            action: 'LOGIN_FAILED',
            metadata: { reason: 'Invalid password' },
            ipAddress: ctx?.ip,
        });
        throw (0, error_middleware_1.createError)('Invalid email address or password.', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        accountType: user.accountType || (user.role === 'admin' ? 'admin' : 'customer'),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
    const tokenPayload = { userId: user.id, email: user.email, role: user.role, accountType: safeUser.accountType };
    const accessToken = jwtUtil.generateAccessToken(tokenPayload);
    const refreshToken = jwtUtil.generateRefreshToken(tokenPayload);
    const tokenHash = await (0, bcrypt_1.hashToken)(refreshToken);
    const days = input.rememberMe ? 30 : 7;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const { browser, device } = (0, activityLog_service_1.parseUserAgent)(ctx?.userAgent);
    await userRepo.storeRefreshToken(user.id, tokenHash, expiresAt, {
        rememberMe: input.rememberMe,
        device,
        browser,
        ipAddress: ctx?.ip || 'Unknown',
    });
    await (0, activityLog_service_1.logActivity)({
        userId: user.id,
        action: 'LOGIN',
        metadata: { role: safeUser.accountType },
        ipAddress: ctx?.ip,
        browser,
        device,
    });
    return { user: safeUser, accessToken, refreshToken };
}
async function logout(refreshToken, ctx) {
    try {
        const tokenHash = await (0, bcrypt_1.hashToken)(refreshToken);
        const stored = await database_1.default.refreshToken.findFirst({ where: { tokenHash } });
        if (stored) {
            await (0, activityLog_service_1.logActivity)({
                userId: stored.userId,
                action: 'LOGOUT',
                ipAddress: ctx?.ip,
            });
        }
        await userRepo.deleteRefreshToken(tokenHash);
    }
    catch {
        // Silently ignore
    }
}
async function refreshAccessToken(refreshToken) {
    let payload;
    try {
        payload = jwtUtil.verifyRefreshToken(refreshToken);
    }
    catch {
        throw (0, error_middleware_1.createError)('Invalid or expired refresh token.', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const allTokens = await database_1.default.refreshToken.findMany({
        where: { userId: payload.userId, expiresAt: { gte: new Date() } },
    });
    let tokenValid = false;
    for (const stored of allTokens) {
        const { compareToken } = await Promise.resolve().then(() => __importStar(require('../utils/bcrypt')));
        const match = await compareToken(refreshToken, stored.tokenHash);
        if (match) {
            tokenValid = true;
            break;
        }
    }
    if (!tokenValid) {
        throw (0, error_middleware_1.createError)('Refresh token has been revoked or expired.', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const user = await userRepo.findUserById(payload.userId);
    if (!user) {
        throw (0, error_middleware_1.createError)('User account no longer exists.', constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    const newAccessToken = jwtUtil.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        accountType: user.accountType || (user.role === 'admin' ? 'admin' : 'customer'),
    });
    return { accessToken: newAccessToken };
}
async function changePassword(userId, input, ctx) {
    const user = await userRepo.findUserWithPasswordById(userId);
    if (!user)
        throw (0, error_middleware_1.createError)('User not found.', constants_1.HTTP_STATUS.NOT_FOUND);
    const valid = await (0, bcrypt_1.comparePassword)(input.currentPassword, user.passwordHash);
    if (!valid)
        throw (0, error_middleware_1.createError)('Current password is incorrect.', constants_1.HTTP_STATUS.BAD_REQUEST);
    const newHash = await (0, bcrypt_1.hashPassword)(input.newPassword);
    await userRepo.updateUser(userId, { passwordHash: newHash });
    await userRepo.deleteAllUserRefreshTokens(userId);
    await (0, activityLog_service_1.logActivity)({
        userId,
        action: 'PASSWORD_CHANGED',
        metadata: { by: 'user_settings' },
        ipAddress: ctx?.ip,
    });
    await (0, notification_service_1.createNotification)({
        userId,
        title: 'Security Alert: Password Changed',
        message: 'Your account password was successfully updated. If you did not make this change, contact support immediately.',
        type: 'password_changed',
    });
}
async function generatePasswordResetToken(email, ctx) {
    const rawToken = crypto_1.default.randomBytes(32).toString('hex');
    const tokenHash = crypto_1.default.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const user = await userRepo.findUserByEmail(email);
    if (user) {
        await database_1.default.passwordResetToken.deleteMany({ where: { email } });
        await database_1.default.passwordResetToken.create({
            data: { email, tokenHash, expiresAt },
        });
        await (0, activityLog_service_1.logActivity)({
            userId: user.id,
            action: 'PASSWORD_RESET_REQUESTED',
            ipAddress: ctx?.ip,
        });
    }
    return rawToken;
}
async function resetPassword(rawToken, newPassword, ctx) {
    const tokenHash = crypto_1.default.createHash('sha256').update(rawToken).digest('hex');
    const resetRecord = await database_1.default.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
        throw (0, error_middleware_1.createError)('Reset token is invalid or has expired.', constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    const user = await userRepo.findUserByEmail(resetRecord.email);
    if (!user)
        throw (0, error_middleware_1.createError)('User not found.', constants_1.HTTP_STATUS.NOT_FOUND);
    const passwordHash = await (0, bcrypt_1.hashPassword)(newPassword);
    await userRepo.updateUser(user.id, { passwordHash });
    await database_1.default.passwordResetToken.update({ where: { tokenHash }, data: { used: true } });
    await userRepo.deleteAllUserRefreshTokens(user.id);
    await (0, activityLog_service_1.logActivity)({
        userId: user.id,
        action: 'PASSWORD_RESET_COMPLETED',
        ipAddress: ctx?.ip,
    });
    await (0, notification_service_1.createNotification)({
        userId: user.id,
        title: 'Password Successfully Reset',
        message: 'Your password has been reset using a secure token recovery link.',
        type: 'password_changed',
    });
}
//# sourceMappingURL=auth.service.js.map