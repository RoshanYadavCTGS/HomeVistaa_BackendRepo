"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLimiter = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("../config/env");
const response_1 = require("../utils/response");
// General API rate limiter
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.env.RATE_LIMIT_WINDOW_MS,
    max: env_1.env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        (0, response_1.sendTooManyRequests)(res, 'Too many requests. Please try again later.');
    },
});
// Strict limiter for auth endpoints
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.env.RATE_LIMIT_WINDOW_MS,
    max: env_1.env.AUTH_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        (0, response_1.sendTooManyRequests)(res, 'Too many authentication attempts. Please try again later.');
    },
    skipSuccessfulRequests: true,
});
// Strict limiter for file uploads
exports.uploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50,
    handler: (_req, res) => {
        (0, response_1.sendTooManyRequests)(res, 'Upload limit reached. Please try again in an hour.');
    },
});
//# sourceMappingURL=rateLimiter.js.map