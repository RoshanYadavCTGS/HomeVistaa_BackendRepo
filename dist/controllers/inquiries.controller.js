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
exports.submitInquiry = submitInquiry;
exports.submitAdvisorInquiry = submitAdvisorInquiry;
exports.submitBrochureRequest = submitBrochureRequest;
exports.getMyInquiries = getMyInquiries;
exports.getAllInquiries = getAllInquiries;
const inquiryRepo = __importStar(require("../repositories/inquiry.repository"));
const response_1 = require("../utils/response");
const email_service_1 = require("../services/email.service");
async function submitInquiry(req, res, next) {
    try {
        const userId = req.user?.userId;
        const inquiry = await inquiryRepo.createInquiry({ ...req.body, userId });
        // Non-blocking confirmation email
        (0, email_service_1.sendInquiryConfirmation)(inquiry.name, inquiry.email, inquiry.propertyName ?? undefined).catch(() => { });
        (0, response_1.sendCreated)(res, { inquiry }, 'Inquiry submitted successfully');
    }
    catch (err) {
        next(err);
    }
}
async function submitAdvisorInquiry(req, res, next) {
    try {
        const inquiry = await inquiryRepo.createInquiry({
            ...req.body,
            inquiryType: 'advisor',
            message: `Advisor contact request from ${req.body.name}`,
        });
        (0, response_1.sendCreated)(res, { inquiry }, 'Advisor contact request submitted');
    }
    catch (err) {
        next(err);
    }
}
async function submitBrochureRequest(req, res, next) {
    try {
        const inquiry = await inquiryRepo.createInquiry({
            ...req.body,
            inquiryType: 'brochure',
            message: `Brochure download request for ${req.body.propertyName ?? 'Property'}`,
        });
        (0, response_1.sendCreated)(res, { inquiry }, 'Brochure request received. We will email it to you shortly.');
    }
    catch (err) {
        next(err);
    }
}
async function getMyInquiries(req, res, next) {
    try {
        const userId = req.user.userId;
        const inquiries = await inquiryRepo.findInquiriesByUserId(userId);
        (0, response_1.sendSuccess)(res, { inquiries }, 'Your inquiries retrieved successfully');
    }
    catch (err) {
        next(err);
    }
}
// Admin
async function getAllInquiries(req, res, next) {
    try {
        const page = parseInt(String(req.query.page ?? '1'), 10);
        const limit = parseInt(String(req.query.limit ?? '20'), 10);
        const type = req.query.type;
        const { inquiries, meta } = await inquiryRepo.findAllInquiries(page, limit, type);
        (0, response_1.sendSuccess)(res, { inquiries }, 'Inquiries retrieved', 200, meta);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=inquiries.controller.js.map