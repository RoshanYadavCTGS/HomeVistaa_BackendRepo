"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBlogs = findBlogs;
exports.findBlogById = findBlogById;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
exports.findInteriors = findInteriors;
exports.findInteriorById = findInteriorById;
const database_1 = __importDefault(require("../config/database"));
const pagination_1 = require("../utils/pagination");
async function findBlogs(page = 1, limit = 20, category) {
    const { skip } = (0, pagination_1.parsePagination)({ page, limit });
    const where = { published: true };
    if (category)
        where.category = category;
    const [total, rows] = await Promise.all([
        database_1.default.blog.count({ where }),
        database_1.default.blog.findMany({
            where,
            orderBy: { publishedAt: 'desc' },
            skip,
            take: limit,
        }),
    ]);
    return { blogs: rows, meta: (0, pagination_1.buildPaginationMeta)(total, page, limit) };
}
async function findBlogById(id) {
    return database_1.default.blog.findUnique({ where: { id } });
}
async function createBlog(data) {
    return database_1.default.blog.create({
        data: { ...data, category: data.category },
    });
}
async function updateBlog(id, data) {
    return database_1.default.blog.update({ where: { id }, data: data });
}
async function deleteBlog(id) {
    return database_1.default.blog.delete({ where: { id } });
}
// ─── Interior Designs ─────────────────────────────────────────────────────────
async function findInteriors(roomType) {
    const where = { active: true };
    if (roomType)
        where.roomType = roomType;
    const rows = await database_1.default.interiorDesign.findMany({
        where,
        orderBy: { createdAt: 'asc' },
    });
    return rows.map((r) => ({
        ...r,
        specsJson: r.specsJson,
    }));
}
async function findInteriorById(id) {
    return database_1.default.interiorDesign.findUnique({ where: { id } });
}
//# sourceMappingURL=blog.repository.js.map