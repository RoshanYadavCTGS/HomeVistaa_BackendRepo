"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDir = exports.uploadMultiple = exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const env_1 = require("./env");
const constants_1 = require("../constants");
// Ensure upload directory exists
const uploadDir = path_1.default.resolve(process.cwd(), env_1.env.UPLOAD_DIR);
exports.uploadDir = uploadDir;
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Disk storage: save with a UUID filename to avoid collisions
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const uniqueName = `${(0, uuid_1.v4)()}${ext}`;
        cb(null, uniqueName);
    },
});
// MIME type validation
const fileFilter = (_req, file, cb) => {
    if (constants_1.ALLOWED_UPLOAD_TYPES.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type '${file.mimetype}' is not allowed. Accepted: ${constants_1.ALLOWED_UPLOAD_TYPES.join(', ')}`));
    }
};
// Single file upload
exports.uploadSingle = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: constants_1.MAX_FILE_SIZE_BYTES },
}).single('file');
// Multiple files upload (max 10)
exports.uploadMultiple = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: constants_1.MAX_FILE_SIZE_BYTES },
}).array('files', 10);
//# sourceMappingURL=multer.js.map