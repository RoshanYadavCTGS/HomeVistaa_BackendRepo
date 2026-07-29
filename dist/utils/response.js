"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendCreated = sendCreated;
exports.sendNoContent = sendNoContent;
exports.sendError = sendError;
exports.sendBadRequest = sendBadRequest;
exports.sendUnauthorized = sendUnauthorized;
exports.sendForbidden = sendForbidden;
exports.sendNotFound = sendNotFound;
exports.sendConflict = sendConflict;
exports.sendTooManyRequests = sendTooManyRequests;
const constants_1 = require("../constants");
function sendSuccess(res, data, message = 'Success', statusCode = constants_1.HTTP_STATUS.OK, meta) {
    const response = { success: true, message, data };
    if (meta)
        response.meta = meta;
    return res.status(statusCode).json(response);
}
function sendCreated(res, data, message = 'Created successfully') {
    return sendSuccess(res, data, message, constants_1.HTTP_STATUS.CREATED);
}
function sendNoContent(res) {
    return res.status(constants_1.HTTP_STATUS.NO_CONTENT).send();
}
function sendError(res, message, statusCode = constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, errors) {
    const response = { success: false, message };
    if (errors)
        response.errors = errors;
    return res.status(statusCode).json(response);
}
function sendBadRequest(res, message = 'Bad request', errors) {
    return sendError(res, message, constants_1.HTTP_STATUS.BAD_REQUEST, errors);
}
function sendUnauthorized(res, message = 'Unauthorized') {
    return sendError(res, message, constants_1.HTTP_STATUS.UNAUTHORIZED);
}
function sendForbidden(res, message = 'Access denied') {
    return sendError(res, message, constants_1.HTTP_STATUS.FORBIDDEN);
}
function sendNotFound(res, message = 'Not found') {
    return sendError(res, message, constants_1.HTTP_STATUS.NOT_FOUND);
}
function sendConflict(res, message = 'Conflict') {
    return sendError(res, message, constants_1.HTTP_STATUS.CONFLICT);
}
function sendTooManyRequests(res, message = 'Too many requests') {
    return sendError(res, message, constants_1.HTTP_STATUS.TOO_MANY_REQUESTS);
}
//# sourceMappingURL=response.js.map