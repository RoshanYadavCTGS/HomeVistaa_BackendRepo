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
const propertiesController = __importStar(require("../controllers/properties.controller"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const property_validator_1 = require("../validators/property.validator");
const router = (0, express_1.Router)();
// Public property routes
router.get('/', (0, validate_middleware_1.validate)(property_validator_1.propertyFiltersSchema, 'query'), propertiesController.getProperties);
router.get('/featured', propertiesController.getFeaturedProperties);
router.get('/:id', propertiesController.getPropertyById);
// Admin only property routes
router.post('/', auth_middleware_1.authenticate, rbac_middleware_1.requireAdmin, (0, validate_middleware_1.validate)(property_validator_1.createPropertySchema), propertiesController.createProperty);
router.delete('/:id', auth_middleware_1.authenticate, rbac_middleware_1.requireAdmin, propertiesController.deleteProperty);
exports.default = router;
//# sourceMappingURL=properties.routes.js.map