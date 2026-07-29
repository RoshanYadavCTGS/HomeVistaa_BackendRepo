import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadSingle } from '../config/multer';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

// Protect all profile routes
router.use(authenticate);

// GET /api/v1/profile -> Return complete logged-in user profile
router.get('/', authController.me);

// PUT /api/v1/profile -> Update all editable profile information
router.put('/', authController.updateProfile);

// POST /api/v1/profile/upload-image -> Upload profile image and save image URL
router.post('/upload-image', uploadLimiter, (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, authController.uploadAvatar);

export default router;
