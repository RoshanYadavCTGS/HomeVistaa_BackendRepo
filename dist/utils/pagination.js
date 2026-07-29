"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePagination = parsePagination;
exports.buildPaginationMeta = buildPaginationMeta;
const constants_1 = require("../constants");
function parsePagination(query) {
    const page = Math.max(1, parseInt(String(query.page ?? constants_1.DEFAULT_PAGE), 10) || constants_1.DEFAULT_PAGE);
    const limit = Math.min(constants_1.MAX_LIMIT, Math.max(1, parseInt(String(query.limit ?? constants_1.DEFAULT_LIMIT), 10) || constants_1.DEFAULT_LIMIT));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}
function buildPaginationMeta(total, page, limit) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}
//# sourceMappingURL=pagination.js.map