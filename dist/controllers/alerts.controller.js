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
exports.getAlerts = getAlerts;
exports.createAlert = createAlert;
exports.deleteAlert = deleteAlert;
const alertRepo = __importStar(require("../repositories/alert.repository"));
const response_1 = require("../utils/response");
async function getAlerts(req, res, next) {
    try {
        const { userId } = req.user;
        const alerts = await alertRepo.getAlertsByUser(userId);
        (0, response_1.sendSuccess)(res, { alerts }, 'Alerts retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function createAlert(req, res, next) {
    try {
        const { userId } = req.user;
        const alert = await alertRepo.createAlert(userId, req.body);
        (0, response_1.sendCreated)(res, { alert }, 'Alert created');
    }
    catch (err) {
        next(err);
    }
}
async function deleteAlert(req, res, next) {
    try {
        const { userId, role } = req.user;
        const alert = await alertRepo.getAlertById(req.params.id);
        if (!alert) {
            (0, response_1.sendNotFound)(res, 'Alert not found');
            return;
        }
        if (alert.userId !== userId && role !== 'admin') {
            (0, response_1.sendForbidden)(res, 'You can only delete your own alerts');
            return;
        }
        await alertRepo.deleteAlert(req.params.id, userId);
        (0, response_1.sendSuccess)(res, null, 'Alert deleted');
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=alerts.controller.js.map