"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlert = createAlert;
exports.getAlertsByUser = getAlertsByUser;
exports.deleteAlert = deleteAlert;
exports.getAlertById = getAlertById;
exports.getAlertsCount = getAlertsCount;
const database_1 = __importDefault(require("../config/database"));
async function createAlert(userId, data) {
    return database_1.default.savedAlert.create({
        data: { userId, ...data, filtersJson: data.filtersJson },
    });
}
async function getAlertsByUser(userId) {
    return database_1.default.savedAlert.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
async function deleteAlert(id, userId) {
    return database_1.default.savedAlert.deleteMany({ where: { id, userId } });
}
async function getAlertById(id) {
    return database_1.default.savedAlert.findUnique({ where: { id } });
}
async function getAlertsCount(userId) {
    return database_1.default.savedAlert.count({ where: { userId } });
}
//# sourceMappingURL=alert.repository.js.map