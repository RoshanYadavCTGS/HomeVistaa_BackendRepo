"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseMembership = exports.getCurrentMembership = void 0;
const database_1 = __importDefault(require("../config/database"));
const getCurrentMembership = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const membership = await database_1.default.membership.findUnique({
            where: { userId },
        });
        res.json({ success: true, membership });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCurrentMembership = getCurrentMembership;
const purchaseMembership = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { planName, planPrice, planType } = req.body;
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year expiry
        // Upsert membership (update if exists, create if not)
        const membership = await database_1.default.membership.upsert({
            where: { userId },
            update: {
                planName,
                planPrice,
                planType,
                purchaseDate: new Date(),
                expiryDate,
                status: 'active',
            },
            create: {
                userId,
                planName,
                planPrice,
                planType,
                expiryDate,
                status: 'active',
            },
        });
        // Log Activity
        await database_1.default.userActivity.create({
            data: {
                userId,
                activityType: 'MEMBERSHIP_PURCHASED',
                referenceId: membership.id,
                description: `Purchased ${planName} membership.`,
            },
        });
        res.json({ success: true, membership, message: 'Membership purchased successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.purchaseMembership = purchaseMembership;
//# sourceMappingURL=membership.controller.js.map