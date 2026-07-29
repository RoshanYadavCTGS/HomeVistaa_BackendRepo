"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = createError;
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const response_1 = require("../utils/response");
const constants_1 = require("../constants");
function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
}
// Global error handler — must be last middleware registered
function errorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) {
    // Log all errors
    logger_1.logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
    });
    // Multer file upload error
    if (err.message?.includes('File type') || err.message?.includes('limit')) {
        (0, response_1.sendError)(res, err.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        return;
    }
    // Prisma errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            // Unique constraint violation
            const fields = err.meta?.target?.join(', ') ?? 'field';
            (0, response_1.sendError)(res, `A record with this ${fields} already exists.`, constants_1.HTTP_STATUS.CONFLICT);
            return;
        }
        if (err.code === 'P2025') {
            // Record not found
            (0, response_1.sendError)(res, 'The requested record was not found.', constants_1.HTTP_STATUS.NOT_FOUND);
            return;
        }
        if (err.code === 'P2003') {
            (0, response_1.sendError)(res, 'Related record not found.', constants_1.HTTP_STATUS.BAD_REQUEST);
            return;
        }
    }
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        (0, response_1.sendError)(res, 'Invalid data provided.', constants_1.HTTP_STATUS.BAD_REQUEST);
        return;
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        (0, response_1.sendError)(res, 'Invalid token.', constants_1.HTTP_STATUS.UNAUTHORIZED);
        return;
    }
    if (err.name === 'TokenExpiredError') {
        (0, response_1.sendError)(res, 'Token has expired.', constants_1.HTTP_STATUS.UNAUTHORIZED);
        return;
    }
    // Operational errors (thrown by createError)
    const appErr = err;
    if (appErr.isOperational && appErr.statusCode) {
        (0, response_1.sendError)(res, appErr.message, appErr.statusCode);
        return;
    }
    // Unknown / programming errors
    (0, response_1.sendError)(res, 'An unexpected error occurred. Please try again.', constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
}
// 404 handler for unmatched routes
function notFoundHandler(req, res) {
    (0, response_1.sendError)(res, `Route ${req.method} ${req.path} not found`, constants_1.HTTP_STATUS.NOT_FOUND);
}
//# sourceMappingURL=error.middleware.js.map