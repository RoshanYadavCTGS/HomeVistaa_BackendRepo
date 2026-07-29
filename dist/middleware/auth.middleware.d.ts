import { Request, Response, NextFunction } from 'express';
export declare function authenticate(req: Request, res: Response, next: NextFunction): void;
export declare function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void;
export declare function normalizeRole(role?: string): string;
/**
 * Reusable permission and role-based authorization middleware
 * Example: authenticate, authorize(['SUPER_ADMIN', 'ADMIN'], ['property:approve'])
 */
export declare function authorize(allowedRoles: string[] | string, requiredPermissions?: string[]): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map