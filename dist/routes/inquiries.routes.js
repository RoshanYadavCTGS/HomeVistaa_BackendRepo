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
const express_1 = require("express");
const inquiriesController = __importStar(require("../controllers/inquiries.controller"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const auth_middleware_2 = require("../middleware/auth.middleware");
const inquiry_validator_1 = require("../validators/inquiry.validator");
const router = (0, express_1.Router)();
// Public inquiry submission (with optional auth to attach userId)
router.post('/', auth_middleware_2.optionalAuthenticate, (0, validate_middleware_1.validate)(inquiry_validator_1.createInquirySchema), inquiriesController.submitInquiry);
router.post('/brochure', (0, validate_middleware_1.validate)(inquiry_validator_1.createInquirySchema), inquiriesController.submitBrochureRequest);
router.post('/advisor', (0, validate_middleware_1.validate)(inquiry_validator_1.createAdvisorInquirySchema), inquiriesController.submitAdvisorInquiry);
// User history
router.get('/my', auth_middleware_1.authenticate, inquiriesController.getMyInquiries);
// Admin
router.get('/', auth_middleware_1.authenticate, rbac_middleware_1.requireAdmin, inquiriesController.getAllInquiries);
exports.default = router;
//# sourceMappingURL=inquiries.routes.js.map