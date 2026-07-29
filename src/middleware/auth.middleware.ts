import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendUnauthorized, sendForbidden } from '../utils/response';
import { AuthenticatedRequest, JwtPayload } from '../types';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendUnauthorized(res, 'Authentication token is missing');
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    sendUnauthorized(res, 'Authentication token is invalid');
    return;
  }

  try {
    const payload: JwtPayload = verifyAccessToken(token);
    (req as AuthenticatedRequest).user = payload;
    next();
  } catch (err) {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
      sendUnauthorized(res, 'Token has expired. Please refresh your session.');
    } else {
      sendUnauthorized(res, 'Invalid authentication token');
    }
  }
}

// Optional auth — attaches user if token present, continues without error if not
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const payload: JwtPayload = verifyAccessToken(token);
        (req as AuthenticatedRequest).user = payload;
      } catch {
        // Ignore invalid token in optional auth
      }
    }
  }

  next();
}

// Helper to normalize enterprise roles and maintain backward compatibility
export function normalizeRole(role?: string): string {
  if (!role) return 'CUSTOMER';
  const r = role.toUpperCase().replace(/\s+/g, '_');
  if (r === 'USER' || r === 'TENANT' || r === 'OWNER') return 'CUSTOMER';
  if (r === 'RELATIONSHIP_MANAGER' || r === 'SALES_MANAGER' || r === 'SALES') return 'SALES_MANAGER';
  return r;
}

/**
 * Reusable permission and role-based authorization middleware
 * Example: authenticate, authorize(['SUPER_ADMIN', 'ADMIN'], ['property:approve'])
 */
export function authorize(
  allowedRoles: string[] | string,
  requiredPermissions?: string[]
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      sendUnauthorized(res, 'Authentication required before authorization');
      return;
    }

    const currentRole = normalizeRole(user.role || user.accountType);
    const targetRoles = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]).map(normalizeRole);

    // Super Admin has unrestricted enterprise platform access
    if (currentRole === 'SUPER_ADMIN') {
      next();
      return;
    }

    // Check enterprise role match
    if (targetRoles.length > 0 && !targetRoles.includes(currentRole)) {
      sendForbidden(res, `Access denied. Your role (${currentRole}) requires one of: ${targetRoles.join(', ')}`);
      return;
    }

    // Check granular RBAC permissions if requested
    if (requiredPermissions && requiredPermissions.length > 0) {
      const userPermissions = user.permissions || [];
      const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));
      if (!hasPermission) {
        sendForbidden(res, `Access denied. Missing required permissions: ${requiredPermissions.join(', ')}`);
        return;
      }
    }

    next();
  };
}
