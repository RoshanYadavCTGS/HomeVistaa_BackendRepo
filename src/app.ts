import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';

import { env } from './config/env';
import { logger } from './utils/logger';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { API_PREFIX } from './constants';
import routes from './routes/index';
import authRoutes from './routes/auth.routes';

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images to load
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (env.CORS_ORIGINS.includes(origin) || env.isDev) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ─── General Middleware ────────────────────────────────────────────────────────
if (env.isProd) {
  app.use(compression());
}
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── HTTP Logging ─────────────────────────────────────────────────────────────
const morganFormat = env.isDev ? 'dev' : 'combined';
app.use(
  morgan(morganFormat, {
    stream: { write: (message) => logger.http(message.trim()) },
    skip: (_req, res) => env.isProd && res.statusCode < 400,
  })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use(generalLimiter);

// ─── Static File Serving (Uploads) ────────────────────────────────────────────
app.use(
  `/${env.UPLOAD_DIR}`,
  express.static(path.resolve(process.cwd(), env.UPLOAD_DIR))
);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use(API_PREFIX, routes);
app.use('/api/auth', authRoutes);

// ─── Root Endpoint ────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'HomeVistaa API',
    version: '1.0.0',
    docs: `${API_PREFIX}/health`,
    environment: env.NODE_ENV,
  });
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
// force restart
