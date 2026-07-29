import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from '../validators/auth.validator';

const router = Router();

// Public authentication endpoints (Email + Password)
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// Protected user routes
router.get('/me', authenticate, authController.me);
router.patch('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);
router.patch('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);
router.get('/dashboard/summary', authenticate, authController.getDashboardSummary);

// Centralized notifications & audit logs
router.get('/notifications', authenticate, authController.getUserNotifications);
router.get('/activity-logs', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), authController.getSystemActivityLogs);

export default router;
