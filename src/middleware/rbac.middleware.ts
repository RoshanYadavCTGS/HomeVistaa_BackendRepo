import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { sendForbidden, sendUnauthorized } from '../utils/response';
import { normalizeRole } from './auth.middleware';

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      sendUnauthorized(res, 'Authentication required');
      return;
    }

    const currentRole = normalizeRole(user.role || user.accountType);
    
    // Super Admin has total platform administrative privileges
    if (currentRole === 'SUPER_ADMIN' || user.role === 'super_admin') {
      next();
      return;
    }

    const targetRoles = roles.map(normalizeRole);
    if (!targetRoles.includes(currentRole) && !roles.includes(user.role || '')) {
      sendForbidden(res, `Access denied. Required enterprise role: ${roles.join(' or ')}`);
      return;
    }

    next();
  };
}

// Enterprise operational shortcuts
export const requireAdmin = requireRole('ADMIN', 'SUPER_ADMIN', 'admin');
export const requireSalesManager = requireRole('SALES_MANAGER', 'ADMIN', 'SUPER_ADMIN');
export const requireBuilder = requireRole('BUILDER', 'ADMIN', 'SUPER_ADMIN');
export const requireUser = (req: Request, res: Response, next: NextFunction) => next(); // All authenticated users
