"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const rateLimiter_1 = require("./middleware/rateLimiter");
const error_middleware_1 = require("./middleware/error.middleware");
const constants_1 = require("./constants");
const index_1 = __importDefault(require("./routes/index"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
// ─── Security Middleware ───────────────────────────────────────────────────────
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images to load
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin)
            return callback(null, true);
        if (env_1.env.CORS_ORIGINS.includes(origin) || env_1.env.isDev) {
            return callback(null, true);
        }
        callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
// ─── General Middleware ────────────────────────────────────────────────────────
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ─── HTTP Logging ─────────────────────────────────────────────────────────────
const morganFormat = env_1.env.isDev ? 'dev' : 'combined';
app.use((0, morgan_1.default)(morganFormat, {
    stream: { write: (message) => logger_1.logger.http(message.trim()) },
    skip: (_req, res) => env_1.env.isProd && res.statusCode < 400,
}));
// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use(rateLimiter_1.generalLimiter);
// ─── Static File Serving (Uploads) ────────────────────────────────────────────
app.use(`/${env_1.env.UPLOAD_DIR}`, express_1.default.static(path_1.default.resolve(process.cwd(), env_1.env.UPLOAD_DIR)));
// ─── API Routes ───────────────────────────────────────────────────────────────
app.use(constants_1.API_PREFIX, index_1.default);
app.use('/api/auth', auth_routes_1.default);
// ─── Root Endpoint ────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
    res.json({
        name: 'HomeVistaa API',
        version: '1.0.0',
        docs: `${constants_1.API_PREFIX}/health`,
        environment: env_1.env.NODE_ENV,
    });
});
// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
exports.default = app;
// force restart
//# sourceMappingURL=app.js.map