import { Response } from 'express';
import { HTTP_STATUS } from '../constants';
import { ApiResponse, PaginationMeta, ValidationError } from '../types';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode: number = HTTP_STATUS.OK,
  meta?: PaginationMeta
): Response {
  const response: ApiResponse<T> = { success: true, message, data };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T, message = 'Created successfully'): Response {
  return sendSuccess(res, data, message, HTTP_STATUS.CREATED);
}

export function sendNoContent(res: Response): Response {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors?: ValidationError[]
): Response {
  const response: ApiResponse = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
}

export function sendBadRequest(res: Response, message = 'Bad request', errors?: ValidationError[]): Response {
  return sendError(res, message, HTTP_STATUS.BAD_REQUEST, errors);
}

export function sendUnauthorized(res: Response, message = 'Unauthorized'): Response {
  return sendError(res, message, HTTP_STATUS.UNAUTHORIZED);
}

export function sendForbidden(res: Response, message = 'Access denied'): Response {
  return sendError(res, message, HTTP_STATUS.FORBIDDEN);
}

export function sendNotFound(res: Response, message = 'Not found'): Response {
  return sendError(res, message, HTTP_STATUS.NOT_FOUND);
}

export function sendConflict(res: Response, message = 'Conflict'): Response {
  return sendError(res, message, HTTP_STATUS.CONFLICT);
}

export function sendTooManyRequests(res: Response, message = 'Too many requests'): Response {
  return sendError(res, message, HTTP_STATUS.TOO_MANY_REQUESTS);
}
