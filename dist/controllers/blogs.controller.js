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
exports.getBlogs = getBlogs;
exports.getBlogById = getBlogById;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
const blogRepo = __importStar(require("../repositories/blog.repository"));
const response_1 = require("../utils/response");
async function getBlogs(req, res, next) {
    try {
        const page = parseInt(String(req.query.page ?? '1'), 10);
        const limit = parseInt(String(req.query.limit ?? '20'), 10);
        const category = req.query.category;
        const { blogs, meta } = await blogRepo.findBlogs(page, limit, category);
        (0, response_1.sendSuccess)(res, { blogs }, 'Blogs retrieved', 200, meta);
    }
    catch (err) {
        next(err);
    }
}
async function getBlogById(req, res, next) {
    try {
        const blog = await blogRepo.findBlogById(req.params.id);
        if (!blog) {
            (0, response_1.sendNotFound)(res, 'Blog not found');
            return;
        }
        (0, response_1.sendSuccess)(res, { blog }, 'Blog retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function createBlog(req, res, next) {
    try {
        const blog = await blogRepo.createBlog(req.body);
        (0, response_1.sendCreated)(res, { blog }, 'Blog created');
    }
    catch (err) {
        next(err);
    }
}
async function updateBlog(req, res, next) {
    try {
        const blog = await blogRepo.updateBlog(req.params.id, req.body);
        (0, response_1.sendSuccess)(res, { blog }, 'Blog updated');
    }
    catch (err) {
        next(err);
    }
}
async function deleteBlog(req, res, next) {
    try {
        await blogRepo.deleteBlog(req.params.id);
        (0, response_1.sendSuccess)(res, null, 'Blog deleted');
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=blogs.controller.js.map