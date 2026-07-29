"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserActivity = void 0;
const database_1 = __importDefault(require("../config/database"));
const getUserActivity = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const activity = await database_1.default.userActivity.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 100, // Limit to recent 100 activities
        });
        res.json({ success: true, activity });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUserActivity = getUserActivity;
//# sourceMappingURL=user-activity.controller.js.map