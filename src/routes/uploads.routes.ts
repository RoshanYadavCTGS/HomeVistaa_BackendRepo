import { Router } from 'express';
import * as uploadsController from '../controllers/uploads.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadLimiter } from '../middleware/rateLimiter';
import { uploadSingle, uploadMultiple } from '../config/multer';

const router = Router();

router.use(authenticate); // All uploads require auth
router.use(uploadLimiter);

// Single file upload
router.post('/', (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, uploadsController.uploadFile);

// Multiple files upload
router.post('/batch', (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, uploadsController.uploadMultipleFiles);

// Delete file
router.delete('/:id', uploadsController.deleteFile);

export default router;
