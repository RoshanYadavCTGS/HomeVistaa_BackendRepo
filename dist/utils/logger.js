"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("../config/env");
const logsDir = path_1.default.resolve(process.cwd(), 'logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
const { combine, timestamp, errors, json, colorize, printf } = winston_1.default.format;
const devFormat = combine(colorize({ all: true }), timestamp({ format: 'HH:mm:ss' }), errors({ stack: true }), printf(({ timestamp: ts, level, message, stack }) => {
    return `${ts} [${level}]: ${stack ?? message}`;
}));
const prodFormat = combine(timestamp(), errors({ stack: true }), json());
exports.logger = winston_1.default.createLogger({
    level: env_1.env.isDev ? 'debug' : 'info',
    format: env_1.env.isDev ? devFormat : prodFormat,
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, 'combined.log'),
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
    exceptionHandlers: [
        new winston_1.default.transports.File({ filename: path_1.default.join(logsDir, 'exceptions.log') }),
    ],
    rejectionHandlers: [
        new winston_1.default.transports.File({ filename: path_1.default.join(logsDir, 'rejections.log') }),
    ],
});
//# sourceMappingURL=logger.js.map