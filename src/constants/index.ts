// ─── Application-wide Constants ───────────────────────────────────────────────

export const APP_NAME = 'HomeVistaa';
export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

// ─── HTTP Status Codes ────────────────────────────────────────────────────────

export const HTTP_STATUS = {
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
} as const;

// ─── JWT ──────────────────────────────────────────────────────────────────────

export const TOKEN_COOKIE_NAME = 'hv_refresh_token';
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: '/',
};

// ─── Pagination Defaults ──────────────────────────────────────────────────────

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// ─── File Upload ──────────────────────────────────────────────────────────────

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];
export const ALLOWED_UPLOAD_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];

// ─── Property Config ──────────────────────────────────────────────────────────

export const CITIES = ['Mumbai', 'Bangalore', 'Delhi NCR', 'Gurgaon', 'Noida', 'Chennai', 'Hyderabad', 'Kolkata', 'Lucknow', 'Navi Mumbai', 'Pune', 'Thane', 'Dubai'] as const;

export const PROPERTY_TYPES = ['apartment', 'villa', 'plot', 'commercial'] as const;

export const SORT_OPTIONS = ['popular', 'price_asc', 'price_desc', 'newest'] as const;

// ─── User Roles ───────────────────────────────────────────────────────────────

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

// ─── Activity Log Actions ─────────────────────────────────────────────────────

export const ACTIVITY = {
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
} as const;
