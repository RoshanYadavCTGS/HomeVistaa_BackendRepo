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
exports.getTransactions = getTransactions;
exports.getTransactionById = getTransactionById;
exports.getTransactionPayments = getTransactionPayments;
exports.getTransactionDocuments = getTransactionDocuments;
exports.getTransactionTimeline = getTransactionTimeline;
exports.createTransaction = createTransaction;
const transactionRepo = __importStar(require("../repositories/transaction.repository"));
const response_1 = require("../utils/response");
async function getTransactions(req, res, next) {
    try {
        const { userId, role } = req.user;
        const { search, propertyType, transactionType, paymentStatus, sort, all } = req.query;
        const filters = {
            search: search,
            propertyType: propertyType,
            transactionType: transactionType,
            paymentStatus: paymentStatus,
            sort: sort,
        };
        // Admins can request all transactions via query param 'all=true'
        if (role === 'admin' && all === 'true') {
            const transactions = await transactionRepo.getAllTransactions(filters);
            (0, response_1.sendSuccess)(res, { transactions }, 'All transactions retrieved (Admin)');
            return;
        }
        const result = await transactionRepo.getTransactionsByUser(userId, filters);
        (0, response_1.sendSuccess)(res, result, 'User transactions retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function getTransactionById(req, res, next) {
    try {
        const { userId, role } = req.user;
        const { id } = req.params;
        if (!id) {
            (0, response_1.sendBadRequest)(res, 'Transaction ID is required');
            return;
        }
        try {
            const transaction = await transactionRepo.getTransactionById(id, userId, role === 'admin');
            if (!transaction) {
                (0, response_1.sendNotFound)(res, 'Transaction not found');
                return;
            }
            (0, response_1.sendSuccess)(res, { transaction }, 'Transaction details retrieved');
        }
        catch (err) {
            if (err.message === 'Access denied') {
                (0, response_1.sendForbidden)(res, 'You do not have permission to view this transaction');
                return;
            }
            throw err;
        }
    }
    catch (err) {
        next(err);
    }
}
async function getTransactionPayments(req, res, next) {
    try {
        const { userId, role } = req.user;
        const { id } = req.params;
        const transaction = await transactionRepo.getTransactionById(id, userId, role === 'admin');
        if (!transaction) {
            (0, response_1.sendNotFound)(res, 'Transaction not found');
            return;
        }
        (0, response_1.sendSuccess)(res, { payments: transaction.payments }, 'Transaction payments retrieved');
    }
    catch (err) {
        if (err.message === 'Access denied') {
            (0, response_1.sendForbidden)(res, 'Access denied');
            return;
        }
        next(err);
    }
}
async function getTransactionDocuments(req, res, next) {
    try {
        const { userId, role } = req.user;
        const { id } = req.params;
        const transaction = await transactionRepo.getTransactionById(id, userId, role === 'admin');
        if (!transaction) {
            (0, response_1.sendNotFound)(res, 'Transaction not found');
            return;
        }
        (0, response_1.sendSuccess)(res, { documents: transaction.documents }, 'Transaction documents retrieved');
    }
    catch (err) {
        if (err.message === 'Access denied') {
            (0, response_1.sendForbidden)(res, 'Access denied');
            return;
        }
        next(err);
    }
}
async function getTransactionTimeline(req, res, next) {
    try {
        const { userId, role } = req.user;
        const { id } = req.params;
        const transaction = await transactionRepo.getTransactionById(id, userId, role === 'admin');
        if (!transaction) {
            (0, response_1.sendNotFound)(res, 'Transaction not found');
            return;
        }
        (0, response_1.sendSuccess)(res, { timeline: transaction.timeline }, 'Transaction timeline retrieved');
    }
    catch (err) {
        if (err.message === 'Access denied') {
            (0, response_1.sendForbidden)(res, 'Access denied');
            return;
        }
        next(err);
    }
}
async function createTransaction(req, res, next) {
    try {
        const { userId } = req.user;
        const { propertyId, transactionType, amountPaid, paymentMethod, paymentStatus, bookingStatus } = req.body;
        if (!propertyId || !transactionType || !amountPaid || !paymentMethod) {
            (0, response_1.sendBadRequest)(res, 'Missing required fields for transaction creation');
            return;
        }
        const transaction = await transactionRepo.createTransaction(userId, {
            propertyId,
            transactionType,
            amountPaid: Number(amountPaid),
            paymentMethod,
            paymentStatus,
            bookingStatus,
        });
        (0, response_1.sendCreated)(res, { transaction: { ...transaction, amountPaid: Number(transaction.amountPaid) } }, 'Transaction recorded successfully');
    }
    catch (err) {
        if (err.message === 'Property not found') {
            (0, response_1.sendBadRequest)(res, 'Invalid propertyId provided');
            return;
        }
        next(err);
    }
}
//# sourceMappingURL=transactions.controller.js.map