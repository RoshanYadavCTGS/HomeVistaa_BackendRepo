import { Request, Response, NextFunction } from 'express';
export declare function register(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function login(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function logout(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function me(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function changePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getDashboardSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getUserNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getSystemActivityLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map