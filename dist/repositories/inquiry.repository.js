"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInquiry = createInquiry;
exports.findAllInquiries = findAllInquiries;
exports.findInquiriesByUserId = findInquiriesByUserId;
exports.markInquiryRead = markInquiryRead;
exports.createServiceRequest = createServiceRequest;
exports.findAllServiceRequests = findAllServiceRequests;
exports.findServiceRequestsByEmail = findServiceRequestsByEmail;
const database_1 = __importDefault(require("../config/database"));
const pagination_1 = require("../utils/pagination");
async function createInquiry(data) {
    return database_1.default.inquiry.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
            inquiryType: data.inquiryType,
            propertyId: data.propertyId,
            propertyName: data.propertyName,
            datePreference: data.datePreference,
            userId: data.userId,
        },
    });
}
async function findAllInquiries(page = 1, limit = 20, type) {
    const { skip } = (0, pagination_1.parsePagination)({ page, limit });
    const where = type ? { inquiryType: { equals: type } } : {};
    const [total, rows] = await Promise.all([
        database_1.default.inquiry.count({ where }),
        database_1.default.inquiry.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
    ]);
    return { inquiries: rows, meta: (0, pagination_1.buildPaginationMeta)(total, page, limit) };
}
async function findInquiriesByUserId(userId) {
    return database_1.default.inquiry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
async function markInquiryRead(id) {
    return database_1.default.inquiry.update({ where: { id }, data: { isRead: true } });
}
// ─── Service Requests ─────────────────────────────────────────────────────────
async function createServiceRequest(data) {
    return database_1.default.serviceRequest.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            details: data.details,
            serviceType: data.serviceType,
        },
    });
}
async function findAllServiceRequests(page = 1, limit = 20) {
    const { skip } = (0, pagination_1.parsePagination)({ page, limit });
    const [total, rows] = await Promise.all([
        database_1.default.serviceRequest.count(),
        database_1.default.serviceRequest.findMany({
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
    ]);
    return { requests: rows, meta: (0, pagination_1.buildPaginationMeta)(total, page, limit) };
}
async function findServiceRequestsByEmail(email) {
    return database_1.default.serviceRequest.findMany({
        where: { email },
        orderBy: { createdAt: 'desc' },
    });
}
//# sourceMappingURL=inquiry.repository.js.map