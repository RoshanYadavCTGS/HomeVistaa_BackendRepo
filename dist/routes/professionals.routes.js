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
const professionalsController = __importStar(require("../controllers/professionals.controller"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const auth_middleware_2 = require("../middleware/auth.middleware");
const professional_validator_1 = require("../validators/professional.validator");
const router = (0, express_1.Router)();
// Public registration (with optional auth to attach userId)
router.post('/', auth_middleware_2.optionalAuthenticate, (0, validate_middleware_1.validate)(professional_validator_1.createProfessionalSchema), professionalsController.registerProfessional);
// Admin
router.get('/', auth_middleware_1.authenticate, rbac_middleware_1.requireAdmin, professionalsController.getAllProfessionals);
router.patch('/:id/status', auth_middleware_1.authenticate, rbac_middleware_1.requireAdmin, (0, validate_middleware_1.validate)(professional_validator_1.updateProfessionalStatusSchema), professionalsController.updateProfessionalStatus);
exports.default = router;
//# sourceMappingURL=professionals.routes.js.map