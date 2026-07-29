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
exports.submitServiceRequest = submitServiceRequest;
exports.getAllServiceRequests = getAllServiceRequests;
exports.getMyServiceRequests = getMyServiceRequests;
const inquiryRepo = __importStar(require("../repositories/inquiry.repository"));
const response_1 = require("../utils/response");
async function submitServiceRequest(req, res, next) {
    try {
        const request = await inquiryRepo.createServiceRequest(req.body);
        (0, response_1.sendCreated)(res, { request }, 'Service request submitted. Our team will contact you within 24 hours.');
    }
    catch (err) {
        next(err);
    }
}
async function getAllServiceRequests(req, res, next) {
    try {
        const page = parseInt(String(req.query.page ?? '1'), 10);
        const limit = parseInt(String(req.query.limit ?? '20'), 10);
        const { requests, meta } = await inquiryRepo.findAllServiceRequests(page, limit);
        (0, response_1.sendSuccess)(res, { requests }, 'Service requests retrieved', 200, meta);
    }
    catch (err) {
        next(err);
    }
}
async function getMyServiceRequests(req, res, next) {
    try {
        // We expect `req.user` to exist because this route will use `authenticate`
        const { email } = req.user;
        if (!email) {
            (0, response_1.sendSuccess)(res, { requests: [] }, 'No email found in user token');
            return;
        }
        const requests = await inquiryRepo.findServiceRequestsByEmail(email);
        (0, response_1.sendSuccess)(res, { requests }, 'User service requests retrieved', 200);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=service-requests.controller.js.map