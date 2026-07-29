"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = createTransaction;
exports.getTransactionsByUser = getTransactionsByUser;
exports.getTransactionById = getTransactionById;
exports.getAllTransactions = getAllTransactions;
const database_1 = __importDefault(require("../config/database"));
async function createTransaction(userId, input) {
    // 1. Fetch property and builder details to snapshot fields
    const property = await database_1.default.property.findUnique({
        where: { id: input.propertyId },
        include: { builder: true }
    });
    if (!property) {
        throw new Error('Property not found');
    }
    // 2. Generate unique invoice number: INV-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${dateStr}-${rand}`;
    return database_1.default.transaction.create({
        data: {
            userId,
            propertyId: input.propertyId,
            propertyName: property.title,
            propertyType: property.type,
            propertyAddress: property.location,
            city: property.city,
            sellerName: property.builder.name,
            transactionType: input.transactionType,
            amountPaid: BigInt(input.amountPaid),
            paymentMethod: input.paymentMethod,
            paymentStatus: input.paymentStatus || 'completed',
            bookingStatus: input.bookingStatus || 'approved',
            invoiceNumber,
            bookingDate: new Date(),
            paymentDate: new Date(),
        }
    });
}
async function getTransactionsByUser(userId, filters) {
    const where = { userId };
    if (filters.search) {
        where.OR = [
            { propertyName: { contains: filters.search, mode: 'insensitive' } },
            { id: { contains: filters.search, mode: 'insensitive' } }
        ];
    }
    if (filters.propertyType) {
        where.propertyType = filters.propertyType;
    }
    if (filters.transactionType) {
        where.transactionType = filters.transactionType;
    }
    if (filters.paymentStatus) {
        where.paymentStatus = filters.paymentStatus;
    }
    let orderBy = { createdAt: 'desc' };
    if (filters.sort) {
        switch (filters.sort) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'amount_desc':
                orderBy = { amountPaid: 'desc' };
                break;
            case 'amount_asc':
                orderBy = { amountPaid: 'asc' };
                break;
            case 'latest':
            default:
                orderBy = { createdAt: 'desc' };
                break;
        }
    }
    const transactions = await database_1.default.transaction.findMany({
        where,
        orderBy,
        include: {
            builder: true,
            property: {
                include: {
                    images: {
                        where: { isPrimary: true },
                        take: 1
                    }
                }
            }
        }
    });
    // Calculate Summary over ALL user transactions
    const allUserTx = await database_1.default.transaction.findMany({ where: { userId } });
    let totalInvestment = 0;
    let activeBookings = 0;
    let completedDeals = 0;
    let cancelled = 0;
    allUserTx.forEach(t => {
        totalInvestment += Number(t.totalAmount || t.amountPaid);
        if (t.paymentStatus === 'completed' || t.transactionStatus === 'Completed') {
            completedDeals++;
        }
        else if (t.paymentStatus === 'cancelled') {
            cancelled++;
        }
        else {
            activeBookings++;
        }
    });
    const summary = {
        totalTransactions: allUserTx.length,
        activeBookings,
        completedDeals,
        cancelled,
        totalInvestment
    };
    // Convert BigInt to number for JSON safety
    const formattedTransactions = transactions.map(t => ({
        ...t,
        amountPaid: Number(t.amountPaid),
        bookingAmount: t.bookingAmount ? Number(t.bookingAmount) : 0,
        totalAmount: t.totalAmount ? Number(t.totalAmount) : 0,
        propertyImage: t.property.images[0]?.url || ''
    }));
    return { summary, transactions: formattedTransactions };
}
async function getTransactionById(id, userId, isAdmin) {
    const transaction = await database_1.default.transaction.findUnique({
        where: { id },
        include: {
            builder: true,
            payments: { orderBy: { installmentNo: 'asc' } },
            documents: { orderBy: { createdAt: 'desc' } },
            timeline: { orderBy: { createdAt: 'asc' } },
            property: {
                include: {
                    images: {
                        where: { isPrimary: true },
                        take: 1
                    }
                }
            }
        }
    });
    if (!transaction)
        return null;
    // Authorization check
    if (transaction.userId !== userId && !isAdmin) {
        throw new Error('Access denied');
    }
    return {
        ...transaction,
        amountPaid: Number(transaction.amountPaid),
        bookingAmount: transaction.bookingAmount ? Number(transaction.bookingAmount) : 0,
        totalAmount: transaction.totalAmount ? Number(transaction.totalAmount) : 0,
        payments: transaction.payments.map(p => ({ ...p, amount: Number(p.amount) })),
        propertyImage: transaction.property.images[0]?.url || ''
    };
}
async function getAllTransactions(filters) {
    const where = {};
    if (filters.search) {
        where.OR = [
            { propertyName: { contains: filters.search, mode: 'insensitive' } },
            { id: { contains: filters.search, mode: 'insensitive' } }
        ];
    }
    if (filters.propertyType) {
        where.propertyType = filters.propertyType;
    }
    if (filters.transactionType) {
        where.transactionType = filters.transactionType;
    }
    if (filters.paymentStatus) {
        where.paymentStatus = filters.paymentStatus;
    }
    let orderBy = { createdAt: 'desc' };
    if (filters.sort) {
        switch (filters.sort) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'amount_desc':
                orderBy = { amountPaid: 'desc' };
                break;
            case 'amount_asc':
                orderBy = { amountPaid: 'asc' };
                break;
            case 'latest':
            default:
                orderBy = { createdAt: 'desc' };
                break;
        }
    }
    const transactions = await database_1.default.transaction.findMany({
        where,
        orderBy,
        include: {
            property: {
                include: {
                    images: {
                        where: { isPrimary: true },
                        take: 1
                    }
                }
            }
        }
    });
    return transactions.map(t => ({
        ...t,
        amountPaid: Number(t.amountPaid),
        propertyImage: t.property.images[0]?.url || ''
    }));
}
//# sourceMappingURL=transaction.repository.js.map