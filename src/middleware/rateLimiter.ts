import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { sendTooManyRequests } from '../utils/response';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendTooManyRequests(res, 'Too many requests. Please try again later.');
  },
});

// Strict limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendTooManyRequests(res, 'Too many authentication attempts. Please try again later.');
  },
  skipSuccessfulRequests: true,
});

// Strict limiter for file uploads
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  handler: (_req, res) => {
    sendTooManyRequests(res, 'Upload limit reached. Please try again in an hour.');
  },
});
