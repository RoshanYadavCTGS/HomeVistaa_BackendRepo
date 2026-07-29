"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env from project root
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
function requireEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
function optionalEnv(key, fallback) {
    return process.env[key] ?? fallback;
}
exports.env = {
    // Server
    NODE_ENV: optionalEnv('NODE_ENV', 'development'),
    PORT: parseInt(optionalEnv('PORT', '5000'), 10),
    isDev: optionalEnv('NODE_ENV', 'development') === 'development',
    isProd: process.env.NODE_ENV === 'production',
    // Database
    DATABASE_URL: requireEnv('DATABASE_URL'),
    // JWT
    JWT_ACCESS_SECRET: requireEnv('JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
    JWT_ACCESS_EXPIRES_IN: optionalEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
    JWT_REFRESH_EXPIRES_IN: optionalEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
    // CORS
    CORS_ORIGINS: optionalEnv('CORS_ORIGINS', 'http://localhost:3000')
        .split(',')
        .map((o) => o.trim()),
    // Uploads
    UPLOAD_DIR: optionalEnv('UPLOAD_DIR', 'uploads'),
    MAX_FILE_SIZE_MB: parseInt(optionalEnv('MAX_FILE_SIZE_MB', '10'), 10),
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: parseInt(optionalEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    RATE_LIMIT_MAX: parseInt(optionalEnv('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
    AUTH_RATE_LIMIT_MAX: parseInt(optionalEnv('AUTH_RATE_LIMIT_MAX', '10'), 10),
    // SMTP
    SMTP_ENABLED: optionalEnv('SMTP_ENABLED', 'false') === 'true',
    SMTP_HOST: optionalEnv('SMTP_HOST', 'smtp.gmail.com'),
    SMTP_PORT: parseInt(optionalEnv('SMTP_PORT', '587'), 10),
    SMTP_SECURE: optionalEnv('SMTP_SECURE', 'false') === 'true',
    SMTP_USER: optionalEnv('SMTP_USER', ''),
    SMTP_PASS: optionalEnv('SMTP_PASS', ''),
    SMTP_FROM_NAME: optionalEnv('SMTP_FROM_NAME', 'HomeVistaa'),
    SMTP_FROM_EMAIL: optionalEnv('SMTP_FROM_EMAIL', 'noreply@homevistaa.com'),
    // Admin Seed
    ADMIN_NAME: optionalEnv('ADMIN_NAME', 'Admin'),
    ADMIN_EMAIL: optionalEnv('ADMIN_EMAIL', 'admin@homevistaa.com'),
    ADMIN_PASSWORD: optionalEnv('ADMIN_PASSWORD', 'Admin@123456'),
};
//# sourceMappingURL=env.js.map