"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const properties_routes_1 = __importDefault(require("./properties.routes"));
const listings_routes_1 = __importDefault(require("./listings.routes"));
const leads_routes_1 = __importDefault(require("./leads.routes"));
const inquiries_routes_1 = __importDefault(require("./inquiries.routes"));
const favorites_routes_1 = __importDefault(require("./favorites.routes"));
const transactions_routes_1 = __importDefault(require("./transactions.routes"));
const blogs_routes_1 = __importDefault(require("./blogs.routes"));
const interiors_routes_1 = __importDefault(require("./interiors.routes"));
const professionals_routes_1 = __importDefault(require("./professionals.routes"));
const service_requests_routes_1 = __importDefault(require("./service-requests.routes"));
const uploads_routes_1 = __importDefault(require("./uploads.routes"));
const property_history_routes_1 = __importDefault(require("./property-history.routes"));
const searchHistory_routes_1 = __importDefault(require("./searchHistory.routes"));
const alerts_routes_1 = __importDefault(require("./alerts.routes"));
const membership_routes_1 = __importDefault(require("./membership.routes"));
const user_activity_routes_1 = __importDefault(require("./user-activity.routes"));
const referrals_routes_1 = __importDefault(require("./referrals.routes"));
const coupons_routes_1 = __importDefault(require("./coupons.routes"));
const profile_routes_1 = __importDefault(require("./profile.routes"));
const loans_routes_1 = __importDefault(require("./loans.routes"));
const router = (0, express_1.Router)();
// ─── API Health Check ─────────────────────────────────────────────────────────
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'HomeVistaa API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
// ─── Route Mounts ─────────────────────────────────────────────────────────────
router.use('/auth', auth_routes_1.default);
router.use('/properties', properties_routes_1.default);
router.use('/listings', listings_routes_1.default);
router.use('/leads', leads_routes_1.default);
router.use('/inquiries', inquiries_routes_1.default);
router.use('/favorites', favorites_routes_1.default);
router.use('/transactions', transactions_routes_1.default);
router.use('/blogs', blogs_routes_1.default);
router.use('/interiors', interiors_routes_1.default);
router.use('/professionals', professionals_routes_1.default);
router.use('/service-requests', service_requests_routes_1.default);
router.use('/uploads', uploads_routes_1.default);
router.use('/property-history', property_history_routes_1.default);
router.use('/search-history', searchHistory_routes_1.default);
router.use('/alerts', alerts_routes_1.default);
router.use('/membership', membership_routes_1.default);
router.use('/user-activity', user_activity_routes_1.default);
router.use('/referrals', referrals_routes_1.default);
router.use('/coupons', coupons_routes_1.default);
router.use('/profile', profile_routes_1.default);
router.use('/loans', loans_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map