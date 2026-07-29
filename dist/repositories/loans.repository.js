"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoanApplication = createLoanApplication;
exports.getLoanApplicationsByUser = getLoanApplicationsByUser;
exports.getLoanApplicationById = getLoanApplicationById;
exports.updateLoanApplication = updateLoanApplication;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createLoanApplication(data) {
    return prisma.loanApplication.create({
        data,
    });
}
async function getLoanApplicationsByUser(userId) {
    return prisma.loanApplication.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
async function getLoanApplicationById(id) {
    return prisma.loanApplication.findUnique({
        where: { id },
    });
}
async function updateLoanApplication(id, data) {
    return prisma.loanApplication.update({
        where: { id },
        data,
    });
}
//# sourceMappingURL=loans.repository.js.map