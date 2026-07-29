export declare const APP_NAME = "HomeVistaa";
export declare const API_VERSION = "v1";
export declare const API_PREFIX = "/api/v1";
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const TOKEN_COOKIE_NAME = "hv_refresh_token";
export declare const COOKIE_OPTIONS: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict";
    maxAge: number;
    path: string;
};
export declare const DEFAULT_PAGE = 1;
export declare const DEFAULT_LIMIT = 20;
export declare const MAX_LIMIT = 100;
export declare const MAX_FILE_SIZE_BYTES: number;
export declare const ALLOWED_IMAGE_TYPES: string[];
export declare const ALLOWED_DOCUMENT_TYPES: string[];
export declare const ALLOWED_UPLOAD_TYPES: string[];
export declare const CITIES: readonly ["Mumbai", "Bangalore", "Delhi NCR", "Gurgaon", "Noida", "Chennai", "Hyderabad", "Kolkata", "Lucknow", "Navi Mumbai", "Pune", "Thane", "Dubai"];
export declare const PROPERTY_TYPES: readonly ["apartment", "villa", "plot", "commercial"];
export declare const SORT_OPTIONS: readonly ["popular", "price_asc", "price_desc", "newest"];
export declare const USER_ROLES: {
    readonly USER: "user";
    readonly ADMIN: "admin";
};
export declare const ACTIVITY: {
    readonly USER_REGISTERED: "user_registered";
    readonly USER_LOGGED_IN: "user_logged_in";
    readonly USER_LOGGED_OUT: "user_logged_out";
    readonly PASSWORD_CHANGED: "password_changed";
    readonly LISTING_CREATED: "listing_created";
    readonly LISTING_UPDATED: "listing_updated";
    readonly LISTING_DELETED: "listing_deleted";
    readonly FAVORITE_ADDED: "favorite_added";
    readonly FAVORITE_REMOVED: "favorite_removed";
    readonly ALERT_CREATED: "alert_created";
    readonly ALERT_DELETED: "alert_deleted";
    readonly INQUIRY_SUBMITTED: "inquiry_submitted";
    readonly FILE_UPLOADED: "file_uploaded";
    readonly FILE_DELETED: "file_deleted";
    readonly PROFESSIONAL_REGISTERED: "professional_registered";
    readonly SERVICE_REQUEST_SUBMITTED: "service_request_submitted";
};
//# sourceMappingURL=index.d.ts.map