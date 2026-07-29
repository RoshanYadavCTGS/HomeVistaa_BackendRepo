"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfessional = createProfessional;
exports.findProfessionalByEmail = findProfessionalByEmail;
exports.findAllProfessionals = findAllProfessionals;
exports.updateProfessionalStatus = updateProfessionalStatus;
const database_1 = __importDefault(require("../config/database"));
const pagination_1 = require("../utils/pagination");
async function createProfessional(data) {
    return database_1.default.professional.create({
        data: {
            ...data,
            role: data.role,
        },
    });
}
async function findProfessionalByEmail(email) {
    return database_1.default.professional.findUnique({ where: { email } });
}
async function findAllProfessionals(page = 1, limit = 20, status) {
    const { skip } = (0, pagination_1.parsePagination)({ page, limit });
    const where = status ? { status: status } : {};
    const [total, rows] = await Promise.all([
        database_1.default.professional.count({ where }),
        database_1.default.professional.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
    ]);
    return { professionals: rows, meta: (0, pagination_1.buildPaginationMeta)(total, page, limit) };
}
async function updateProfessionalStatus(id, status, adminNote) {
    return database_1.default.professional.update({
        where: { id },
        data: {
            status: status,
            adminNote,
        },
    });
}
//# sourceMappingURL=professional.repository.js.map