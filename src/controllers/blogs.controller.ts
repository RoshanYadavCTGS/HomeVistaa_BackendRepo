import { Request, Response, NextFunction } from 'express';
import * as blogRepo from '../repositories/blog.repository';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response';

export async function getBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const limit = parseInt(String(req.query.limit ?? '20'), 10);
    const category = req.query.category as string | undefined;
    const { blogs, meta } = await blogRepo.findBlogs(page, limit, category);
    sendSuccess(res, { blogs }, 'Blogs retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
}

export async function getBlogById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const blog = await blogRepo.findBlogById(req.params.id!);
    if (!blog) {
      sendNotFound(res, 'Blog not found');
      return;
    }
    sendSuccess(res, { blog }, 'Blog retrieved');
  } catch (err) {
    next(err);
  }
}

export async function createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const blog = await blogRepo.createBlog(req.body);
    sendCreated(res, { blog }, 'Blog created');
  } catch (err) {
    next(err);
  }
}

export async function updateBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const blog = await blogRepo.updateBlog(req.params.id!, req.body);
    sendSuccess(res, { blog }, 'Blog updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await blogRepo.deleteBlog(req.params.id!);
    sendSuccess(res, null, 'Blog deleted');
  } catch (err) {
    next(err);
  }
}
