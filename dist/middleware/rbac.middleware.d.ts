import { Request, Response, NextFunction } from 'express';
export declare function requireRole(...roles: string[]): (req: Request, res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireSalesManager: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireBuilder: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireUser: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rbac.middleware.d.ts.map