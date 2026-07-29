import { Response } from 'express';
import { PaginationMeta, ValidationError } from '../types';
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number, meta?: PaginationMeta): Response;
export declare function sendCreated<T>(res: Response, data: T, message?: string): Response;
export declare function sendNoContent(res: Response): Response;
export declare function sendError(res: Response, message: string, statusCode?: number, errors?: ValidationError[]): Response;
export declare function sendBadRequest(res: Response, message?: string, errors?: ValidationError[]): Response;
export declare function sendUnauthorized(res: Response, message?: string): Response;
export declare function sendForbidden(res: Response, message?: string): Response;
export declare function sendNotFound(res: Response, message?: string): Response;
export declare function sendConflict(res: Response, message?: string): Response;
export declare function sendTooManyRequests(res: Response, message?: string): Response;
//# sourceMappingURL=response.d.ts.map