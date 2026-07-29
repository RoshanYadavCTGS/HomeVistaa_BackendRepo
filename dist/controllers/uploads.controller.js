"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = uploadFile;
exports.uploadMultipleFiles = uploadMultipleFiles;
exports.deleteFile = deleteFile;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const database_1 = __importDefault(require("../config/database"));
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
// Build public URL for uploaded file
function buildFileUrl(filename, req) {
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}/${env_1.env.UPLOAD_DIR}/${filename}`;
}
async function uploadFile(req, res, next) {
    try {
        if (!req.file) {
            (0, response_1.sendBadRequest)(res, 'No file was uploaded');
            return;
        }
        const userId = req.user.userId;
        const url = buildFileUrl(req.file.filename, req);
        const record = await database_1.default.uploadFile.create({
            data: {
                userId,
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                url,
            },
        });
        (0, response_1.sendCreated)(res, { file: record }, 'File uploaded successfully');
    }
    catch (err) {
        next(err);
    }
}
async function uploadMultipleFiles(req, res, next) {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            (0, response_1.sendBadRequest)(res, 'No files were uploaded');
            return;
        }
        const userId = req.user.userId;
        const records = await Promise.all(files.map((file) => database_1.default.uploadFile.create({
            data: {
                userId,
                filename: file.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                url: buildFileUrl(file.filename, req),
            },
        })));
        (0, response_1.sendCreated)(res, { files: records }, `${records.length} file(s) uploaded`);
    }
    catch (err) {
        next(err);
    }
}
async function deleteFile(req, res, next) {
    try {
        const { userId, role } = req.user;
        const fileId = req.params.id;
        const record = await database_1.default.uploadFile.findUnique({ where: { id: fileId } });
        if (!record) {
            (0, response_1.sendNotFound)(res, 'File not found');
            return;
        }
        if (record.userId !== userId && role !== 'admin') {
            (0, response_1.sendForbidden)(res, 'You can only delete your own files');
            return;
        }
        // Remove from disk
        const filePath = path_1.default.resolve(process.cwd(), env_1.env.UPLOAD_DIR, record.filename);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        await database_1.default.uploadFile.delete({ where: { id: fileId } });
        (0, response_1.sendSuccess)(res, null, 'File deleted');
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=uploads.controller.js.map