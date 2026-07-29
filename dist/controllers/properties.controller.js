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
exports.getProperties = getProperties;
exports.getPropertyById = getPropertyById;
exports.getFeaturedProperties = getFeaturedProperties;
exports.createProperty = createProperty;
exports.deleteProperty = deleteProperty;
const propertyRepo = __importStar(require("../repositories/property.repository"));
const response_1 = require("../utils/response");
async function getProperties(req, res, next) {
    try {
        const filters = req.query;
        const { properties, meta } = await propertyRepo.findProperties(filters);
        (0, response_1.sendSuccess)(res, { properties }, 'Properties retrieved', 200, meta);
    }
    catch (err) {
        next(err);
    }
}
async function getPropertyById(req, res, next) {
    try {
        const property = await propertyRepo.findPropertyById(req.params.id);
        if (!property) {
            (0, response_1.sendNotFound)(res, 'Property not found');
            return;
        }
        (0, response_1.sendSuccess)(res, { property }, 'Property retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function getFeaturedProperties(req, res, next) {
    try {
        const limit = parseInt(String(req.query.limit ?? '6'), 10);
        const properties = await propertyRepo.getFeaturedProperties(limit);
        (0, response_1.sendSuccess)(res, { properties }, 'Featured properties retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function createProperty(req, res, next) {
    try {
        const property = await propertyRepo.createProperty(req.body);
        (0, response_1.sendCreated)(res, { property }, 'Property created');
    }
    catch (err) {
        next(err);
    }
}
async function deleteProperty(req, res, next) {
    try {
        await propertyRepo.deleteProperty(req.params.id);
        (0, response_1.sendSuccess)(res, null, 'Property deleted');
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=properties.controller.js.map