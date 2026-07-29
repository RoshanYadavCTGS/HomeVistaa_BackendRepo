"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
exports.getUnreadNotifications = getUnreadNotifications;
exports.getAllNotifications = getAllNotifications;
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
async function createNotification(input) {
    try {
        await database_1.default.notification.create({
            data: {
                userId: input.userId,
                title: input.title,
                message: input.message,
                type: input.type,
                metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : null,
                isRead: false,
            },
        });
        logger_1.logger.info(`[Notification] Sent '${input.type}' to user ${input.userId}: ${input.title}`);
    }
    catch (error) {
        logger_1.logger.error('Failed to create system notification:', error);
    }
}
async function getUnreadNotifications(userId, limit = 50) {
    return database_1.default.notification.findMany({
        where: { userId, isRead: false },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
}
async function getAllNotifications(userId, limit = 50) {
    return database_1.default.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
}
async function markAsRead(notificationId, userId) {
    return database_1.default.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true },
    });
}
async function markAllAsRead(userId) {
    return database_1.default.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
}
//# sourceMappingURL=notification.service.js.map