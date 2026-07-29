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
exports.createLoanApplication = createLoanApplication;
exports.getMyLoanApplications = getMyLoanApplications;
const loansRepo = __importStar(require("../repositories/loans.repository"));
const response_1 = require("../utils/response");
async function createLoanApplication(req, res, next) {
    try {
        const { userId } = req.user;
        const loanApp = await loansRepo.createLoanApplication({
            ...req.body,
            userId,
        });
        (0, response_1.sendCreated)(res, { loanApp }, 'Loan application submitted successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getMyLoanApplications(req, res, next) {
    try {
        const { userId } = req.user;
        const loanApps = await loansRepo.getLoanApplicationsByUser(userId);
        // We need to convert BigInts to string/number for JSON response
        const formatted = loanApps.map((app) => ({
            ...app,
            loanAmount: Number(app.loanAmount),
            monthlyIncome: Number(app.monthlyIncome),
        }));
        (0, response_1.sendSuccess)(res, { loanApps: formatted }, 'Loan applications retrieved');
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=loans.controller.js.map