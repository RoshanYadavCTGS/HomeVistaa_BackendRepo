import { Router } from 'express';
import * as blogsController from '../controllers/blogs.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/rbac.middleware';

const router = Router();

// Public
router.get('/', blogsController.getBlogs);
router.get('/:id', blogsController.getBlogById);

// Admin only
router.post('/', authenticate, requireAdmin, blogsController.createBlog);
router.patch('/:id', authenticate, requireAdmin, blogsController.updateBlog);
router.delete('/:id', authenticate, requireAdmin, blogsController.deleteBlog);

export default router;
