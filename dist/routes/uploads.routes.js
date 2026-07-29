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
const uploadsController = __importStar(require("../controllers/uploads.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const rateLimiter_1 = require("../middleware/rateLimiter");
const multer_1 = require("../config/multer");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate); // All uploads require auth
router.use(rateLimiter_1.uploadLimiter);
// Single file upload
router.post('/', (req, res, next) => {
    (0, multer_1.uploadSingle)(req, res, (err) => {
        if (err)
            return next(err);
        next();
    });
}, uploadsController.uploadFile);
// Multiple files upload
router.post('/batch', (req, res, next) => {
    (0, multer_1.uploadMultiple)(req, res, (err) => {
        if (err)
            return next(err);
        next();
    });
}, uploadsController.uploadMultipleFiles);
// Delete file
router.delete('/:id', uploadsController.deleteFile);
exports.default = router;
//# sourceMappingURL=uploads.routes.js.map