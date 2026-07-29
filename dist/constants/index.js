"use strict";
// ─── Application-wide Constants ───────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTIVITY = exports.USER_ROLES = exports.SORT_OPTIONS = exports.PROPERTY_TYPES = exports.CITIES = exports.ALLOWED_UPLOAD_TYPES = exports.ALLOWED_DOCUMENT_TYPES = exports.ALLOWED_IMAGE_TYPES = exports.MAX_FILE_SIZE_BYTES = exports.MAX_LIMIT = exports.DEFAULT_LIMIT = exports.DEFAULT_PAGE = exports.COOKIE_OPTIONS = exports.TOKEN_COOKIE_NAME = exports.HTTP_STATUS = exports.API_PREFIX = exports.API_VERSION = exports.APP_NAME = void 0;
exports.APP_NAME = 'HomeVistaa';
exports.API_VERSION = 'v1';
exports.API_PREFIX = `/api/${exports.API_VERSION}`;
// ─── HTTP Status Codes ────────────────────────────────────────────────────────
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
};
// ─── JWT ──────────────────────────────────────────────────────────────────────
exports.TOKEN_COOKIE_NAME = 'hv_refresh_token';
exports.COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/',
};
// ─── Pagination Defaults ──────────────────────────────────────────────────────
exports.DEFAULT_PAGE = 1;
exports.DEFAULT_LIMIT = 20;
exports.MAX_LIMIT = 100;
// ─── File Upload ──────────────────────────────────────────────────────────────
exports.MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
exports.ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
];
exports.ALLOWED_DOCUMENT_TYPES = ['application/pdf'];
exports.ALLOWED_UPLOAD_TYPES = [...exports.ALLOWED_IMAGE_TYPES, ...exports.ALLOWED_DOCUMENT_TYPES];
// ─── Property Config ──────────────────────────────────────────────────────────
exports.CITIES = ['Mumbai', 'Bangalore', 'Delhi NCR', 'Gurgaon', 'Noida', 'Chennai', 'Hyderabad', 'Kolkata', 'Lucknow', 'Navi Mumbai', 'Pune', 'Thane', 'Dubai'];
exports.PROPERTY_TYPES = ['apartment', 'villa', 'plot', 'commercial'];
exports.SORT_OPTIONS = ['popular', 'price_asc', 'price_desc', 'newest'];
// ─── User Roles ───────────────────────────────────────────────────────────────
exports.USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
};
// ─── Activity Log Actions ─────────────────────────────────────────────────────
exports.ACTIVITY = {
    USER_REGISTERED: 'user_registered',
    USER_LOGGED_IN: 'user_logged_in',
    USER_LOGGED_OUT: 'user_logged_out',
    PASSWORD_CHANGED: 'password_changed',
    LISTING_CREATED: 'listing_created',
    LISTING_UPDATED: 'listing_updated',
    LISTING_DELETED: 'listing_deleted',
    FAVORITE_ADDED: 'favorite_added',
    FAVORITE_REMOVED: 'favorite_removed',
    ALERT_CREATED: 'alert_created',
    ALERT_DELETED: 'alert_deleted',
    INQUIRY_SUBMITTED: 'inquiry_submitted',
    FILE_UPLOADED: 'file_uploaded',
    FILE_DELETED: 'file_deleted',
    PROFESSIONAL_REGISTERED: 'professional_registered',
    SERVICE_REQUEST_SUBMITTED: 'service_request_submitted',
};
//# sourceMappingURL=index.js.map