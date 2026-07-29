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
exports.registerProfessional = registerProfessional;
exports.getAllProfessionals = getAllProfessionals;
exports.updateProfessionalStatus = updateProfessionalStatus;
const professionalRepo = __importStar(require("../repositories/professional.repository"));
const response_1 = require("../utils/response");
async function registerProfessional(req, res, next) {
    try {
        const userId = req.user?.userId;
        // Check for duplicate email
        const existing = await professionalRepo.findProfessionalByEmail(req.body.email);
        if (existing) {
            (0, response_1.sendConflict)(res, 'A professional with this email is already registered.');
            return;
        }
        const professional = await professionalRepo.createProfessional({
            ...req.body,
            userId,
        });
        (0, response_1.sendCreated)(res, { professional }, 'Professional registration submitted for review');
    }
    catch (err) {
        next(err);
    }
}
async function getAllProfessionals(req, res, next) {
    try {
        const page = parseInt(String(req.query.page ?? '1'), 10);
        const limit = parseInt(String(req.query.limit ?? '20'), 10);
        const status = req.query.status;
        const { professionals, meta } = await professionalRepo.findAllProfessionals(page, limit, status);
        (0, response_1.sendSuccess)(res, { professionals }, 'Professionals retrieved', 200, meta);
    }
    catch (err) {
        next(err);
    }
}
async function updateProfessionalStatus(req, res, next) {
    try {
        const { status, adminNote } = req.body;
        const professional = await professionalRepo.updateProfessionalStatus(req.params.id, status, adminNote);
        (0, response_1.sendSuccess)(res, { professional }, `Professional status updated to ${status}`);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=professionals.controller.js.map