"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUserAgent = parseUserAgent;
exports.logActivity = logActivity;
exports.getActivityLogs = getActivityLogs;
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
/**
 * Parses User-Agent string for Browser and Device identification
 */
function parseUserAgent(ua) {
    if (!ua)
        return { browser: 'Unknown Browser', device: 'Unknown Device' };
    let browser = 'Chrome / Safari';
    if (ua.includes('Firefox'))
        browser = 'Firefox';
    else if (ua.includes('Edg/'))
        browser = 'Microsoft Edge';
    else if (ua.includes('Chrome'))
        browser = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome'))
        browser = 'Safari';
    else if (ua.includes('Opera') || ua.includes('OPR'))
        browser = 'Opera';
    let device = 'Desktop';
    if (ua.includes('Mobi') || ua.includes('Android') || ua.includes('iPhone')) {
        device = 'Mobile';
    }
    else if (ua.includes('Tablet') || ua.includes('iPad')) {
        device = 'Tablet';
    }
    return { browser, device };
}
/**
 * Centralized activity log creation tracking user, action, IP, browser, and device
 */
async function logActivity(input) {
    try {
        let ipAddress = input.ipAddress;
        let browser = input.browser;
        let device = input.device;
        if (input.req && (!ipAddress || !browser || !device)) {
            const forwarded = input.req.headers['x-forwarded-for'];
            ipAddress = ipAddress || (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]) || input.req.ip || input.req.socket.remoteAddress || '127.0.0.1';
            const ua = input.req.headers['user-agent'];
            const parsed = parseUserAgent(ua);
            browser = browser || parsed.browser;
            device = device || parsed.device;
        }
        await database_1.default.activityLog.create({
            data: {
                userId: input.userId || null,
                action: input.action,
                entityType: input.entityType || null,
                entityId: input.entityId || null,
                metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : null,
                ipAddress: ipAddress || '127.0.0.1',
                browser: browser || 'Unknown Browser',
                device: device || 'Unknown Device',
            },
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to write activity log:', error);
    }
}
async function getActivityLogs(limit = 100, userId, action) {
    const where = {};
    if (userId)
        where.userId = userId;
    if (action)
        where.action = action;
    return database_1.default.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
            user: {
                select: { name: true, email: true, role: true, avatarUrl: true },
            },
        },
    });
}
//# sourceMappingURL=activityLog.service.js.map