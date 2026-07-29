import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare function createError(message: string, statusCode: number): AppError;
export declare function errorHandler(err: AppError | Error, req: Request, res: Response, _next: NextFunction): void;
export declare function notFoundHandler(req: Request, res: Response): void;
//# sourceMappingURL=error.middleware.d.ts.map