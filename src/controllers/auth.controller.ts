import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import * as userRepo from '../repositories/user.repository';
import * as notificationService from '../services/notification.service';
import * as activityLogService from '../services/activityLog.service';
import { sendSuccess, sendCreated, sendNoContent, sendBadRequest, sendNotFound } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { TOKEN_COOKIE_NAME, COOKIE_OPTIONS } from '../constants';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/email.service';
import { env } from '../config/env';

function getReqContext(req: Request): authService.AuthRequestContext {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]) || req.ip || req.socket.remoteAddress || '127.0.0.1';
  return { ip, userAgent: req.headers['user-agent'] };
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body, getReqContext(req));
    const cookieOpts = { ...COOKIE_OPTIONS, maxAge: (req.body.rememberMe ? 30 : 7) * 24 * 3600 * 1000 };
    res.cookie(TOKEN_COOKIE_NAME, refreshToken, cookieOpts);
    sendWelcomeEmail(user.name, user.email).catch(() => {});
    sendCreated(res, { user, accessToken }, 'Account profile registered successfully');
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body, getReqContext(req));
    const cookieOpts = { ...COOKIE_OPTIONS, maxAge: (req.body.rememberMe ? 30 : 7) * 24 * 3600 * 1000 };
    res.cookie(TOKEN_COOKIE_NAME, refreshToken, cookieOpts);
    sendSuccess(res, { user, accessToken }, 'Authentication successful');
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.[TOKEN_COOKIE_NAME] ?? req.body?.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken, getReqContext(req));
    }
    res.clearCookie(TOKEN_COOKIE_NAME, { path: '/' });
    sendNoContent(res);
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.[TOKEN_COOKIE_NAME] ?? req.body?.refreshToken;
    if (!refreshToken) {
      sendBadRequest(res, 'Refresh token is required');
      return;
    }
    const { accessToken } = await authService.refreshAccessToken(refreshToken);
    sendSuccess(res, { accessToken }, 'Access token refreshed');
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const user = await userRepo.findUserById(userId);
    if (!user) {
      sendNotFound(res, 'User profile not found');
      return;
    }
    sendSuccess(res, { user }, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    await authService.changePassword(userId, req.body, getReqContext(req));
    res.clearCookie(TOKEN_COOKIE_NAME, { path: '/' });
    sendSuccess(res, null, 'Password updated. Please sign in again.');
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;
    const rawToken = await authService.generatePasswordResetToken(email, getReqContext(req));
    const resetUrl = `${env.CORS_ORIGINS[0] || 'http://localhost:3000'}/reset-password?token=${rawToken}`;
    sendPasswordResetEmail(email, resetUrl).catch(() => {});
    sendSuccess(res, null, 'If an account exists for this email, a password recovery link has been sent.');
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword, getReqContext(req));
    sendSuccess(res, null, 'Password successfully reset. You may now log in.');
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { 
      name, phone, avatarUrl, 
      dob, city, pinCode, preferredLanguages, 
      propertyPreferences, employmentDetails,
      accountType, addressDetails, securitySettings,
      notificationPrefs, documents
    } = req.body;

    let parsedDob: Date | undefined;
    if (dob) parsedDob = new Date(dob);

    const updated = await userRepo.updateUser(userId, { 
      name, phone, avatarUrl,
      ...(parsedDob && { dob: parsedDob }),
      ...(city !== undefined && { city }),
      ...(pinCode !== undefined && { pinCode }),
      ...(preferredLanguages && { preferredLanguages }),
      ...(propertyPreferences !== undefined && { propertyPreferences }),
      ...(employmentDetails !== undefined && { employmentDetails }),
      ...(accountType !== undefined && { accountType }),
      ...(addressDetails !== undefined && { addressDetails }),
      ...(securitySettings !== undefined && { securitySettings }),
      ...(notificationPrefs !== undefined && { notificationPrefs }),
      ...(documents !== undefined && { documents }),
    });

    await activityLogService.logActivity({
      userId,
      action: 'PROFILE_UPDATED',
      metadata: { fieldsUpdated: Object.keys(req.body) },
      ...getReqContext(req),
    });

    sendSuccess(res, { user: updated }, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function getDashboardSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const stats = await userRepo.getUserStats(userId);
    sendSuccess(res, stats, 'Dashboard operational metrics retrieved');
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      sendBadRequest(res, 'No avatar file attached');
      return;
    }
    const { userId } = (req as AuthenticatedRequest).user;
    const protocol = req.protocol;
    const host = req.get('host');
    const url = `${protocol}://${host}/${env.UPLOAD_DIR}/${req.file.filename}`;
    const updatedUser = await userRepo.updateUser(userId, { avatarUrl: url });
    sendSuccess(res, { user: updatedUser, url }, 'Avatar uploaded');
  } catch (err) {
    next(err);
  }
}

export async function getUserNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const notifications = await notificationService.getAllNotifications(userId);
    sendSuccess(res, { notifications }, 'Notifications fetched');
  } catch (err) {
    next(err);
  }
}

export async function getSystemActivityLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const logs = await activityLogService.getActivityLogs(100);
    sendSuccess(res, { logs }, 'Activity logs fetched');
  } catch (err) {
    next(err);
  }
}
