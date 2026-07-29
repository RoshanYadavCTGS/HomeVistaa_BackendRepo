import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function createError(message: string, statusCode: number): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

// Global error handler — must be last middleware registered
export function errorHandler(
  err: AppError | Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Log all errors
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Multer file upload error
  if (err.message?.includes('File type') || err.message?.includes('limit')) {
    sendError(res, err.message, HTTP_STATUS.BAD_REQUEST);
    return;
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      // Unique constraint violation
      const fields = (err.meta?.target as string[])?.join(', ') ?? 'field';
      sendError(res, `A record with this ${fields} already exists.`, HTTP_STATUS.CONFLICT);
      return;
    }
    if (err.code === 'P2025') {
      // Record not found
      sendError(res, 'The requested record was not found.', HTTP_STATUS.NOT_FOUND);
      return;
    }
    if (err.code === 'P2003') {
      sendError(res, 'Related record not found.', HTTP_STATUS.BAD_REQUEST);
      return;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    sendError(res, 'Invalid data provided.', HTTP_STATUS.BAD_REQUEST);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token.', HTTP_STATUS.UNAUTHORIZED);
    return;
  }
  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token has expired.', HTTP_STATUS.UNAUTHORIZED);
    return;
  }

  // Operational errors (thrown by createError)
  const appErr = err as AppError;
  if (appErr.isOperational && appErr.statusCode) {
    sendError(res, appErr.message, appErr.statusCode);
    return;
  }

  // Unknown / programming errors
  sendError(res, 'An unexpected error occurred. Please try again.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
}

// 404 handler for unmatched routes
export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Route ${req.method} ${req.path} not found`, HTTP_STATUS.NOT_FOUND);
}
