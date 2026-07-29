import * as userRepo from '../repositories/user.repository';
import * as jwtUtil from '../utils/jwt';
import { hashPassword, comparePassword, hashToken } from '../utils/bcrypt';
import { createError } from '../middleware/error.middleware';
import { HTTP_STATUS } from '../constants';
import { RegisterInput, LoginInput, ChangePasswordInput } from '../validators/auth.validator';
import crypto from 'crypto';
import prisma from '../config/database';
import { logActivity, parseUserAgent } from './activityLog.service';
import { createNotification } from './notification.service';
import { UserRole } from '@prisma/client';

export interface AuthRequestContext {
  ip?: string;
  userAgent?: string;
}

export async function register(input: RegisterInput, ctx?: AuthRequestContext) {
  const existing = await userRepo.findUserByEmail(input.email);
  if (existing) {
    throw createError('An account with this email address already exists.', HTTP_STATUS.CONFLICT);
  }

  const passwordHash = await hashPassword(input.password);
  
  // Determine role mapping
  let targetRole: UserRole = 'user';
  let targetAccountType = 'customer';
  if (input.role) {
    const norm = input.role.toLowerCase().replace(/\s+/g, '_');
    if (['admin', 'super_admin'].includes(norm)) targetRole = 'admin';
    targetAccountType = norm;
  }

  const user = await userRepo.createUser({
    name: input.name,
    email: input.email,
    passwordHash,
    role: targetRole,
    accountType: targetAccountType,
  });

  const tokenPayload = { userId: user.id, email: user.email, role: user.role, accountType: user.accountType || targetAccountType };
  const accessToken = jwtUtil.generateAccessToken(tokenPayload);
  const refreshToken = jwtUtil.generateRefreshToken(tokenPayload);

  const tokenHash = await hashToken(refreshToken);
  const days = input.rememberMe ? 30 : 7;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const { browser, device } = parseUserAgent(ctx?.userAgent);
  
  await userRepo.storeRefreshToken(user.id, tokenHash, expiresAt, {
    rememberMe: input.rememberMe,
    device,
    browser,
    ipAddress: ctx?.ip || 'Unknown',
  });

  await logActivity({
    userId: user.id,
    action: 'REGISTER',
    entityType: 'user',
    entityId: user.id,
    metadata: { accountType: user.accountType },
    ipAddress: ctx?.ip,
    browser,
    device,
  });

  await createNotification({
    userId: user.id,
    title: 'Welcome to HomeVistaa!',
    message: 'Your account has been successfully created with secure Email & Password authentication.',
    type: 'account_created',
  });

  return { user, accessToken, refreshToken };
}

export async function login(input: LoginInput, ctx?: AuthRequestContext) {
  const user = await userRepo.findUserByEmail(input.email);
  if (!user) {
    throw createError('Invalid email address or password.', HTTP_STATUS.UNAUTHORIZED);
  }

  const isPasswordValid = await comparePassword(input.password, user.passwordHash);
  if (!isPasswordValid) {
    await logActivity({
      userId: user.id,
      action: 'LOGIN_FAILED',
      metadata: { reason: 'Invalid password' },
      ipAddress: ctx?.ip,
    });
    throw createError('Invalid email address or password.', HTTP_STATUS.UNAUTHORIZED);
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    accountType: user.accountType || (user.role === 'admin' ? 'admin' : 'customer'),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const tokenPayload = { userId: user.id, email: user.email, role: user.role, accountType: safeUser.accountType };
  const accessToken = jwtUtil.generateAccessToken(tokenPayload);
  const refreshToken = jwtUtil.generateRefreshToken(tokenPayload);

  const tokenHash = await hashToken(refreshToken);
  const days = input.rememberMe ? 30 : 7;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const { browser, device } = parseUserAgent(ctx?.userAgent);

  await userRepo.storeRefreshToken(user.id, tokenHash, expiresAt, {
    rememberMe: input.rememberMe,
    device,
    browser,
    ipAddress: ctx?.ip || 'Unknown',
  });

  await logActivity({
    userId: user.id,
    action: 'LOGIN',
    metadata: { role: safeUser.accountType },
    ipAddress: ctx?.ip,
    browser,
    device,
  });

  return { user: safeUser, accessToken, refreshToken };
}

export async function logout(refreshToken: string, ctx?: AuthRequestContext) {
  try {
    const tokenHash = await hashToken(refreshToken);
    const stored = await prisma.refreshToken.findFirst({ where: { tokenHash } });
    if (stored) {
      await logActivity({
        userId: stored.userId,
        action: 'LOGOUT',
        ipAddress: ctx?.ip,
      });
    }
    await userRepo.deleteRefreshToken(tokenHash);
  } catch {
    // Silently ignore
  }
}

export async function refreshAccessToken(refreshToken: string) {
  let payload: ReturnType<typeof jwtUtil.verifyRefreshToken>;

  try {
    payload = jwtUtil.verifyRefreshToken(refreshToken);
  } catch {
    throw createError('Invalid or expired refresh token.', HTTP_STATUS.UNAUTHORIZED);
  }

  const allTokens = await prisma.refreshToken.findMany({
    where: { userId: payload.userId, expiresAt: { gte: new Date() } },
  });

  let tokenValid = false;
  for (const stored of allTokens) {
    const { compareToken } = await import('../utils/bcrypt');
    const match = await compareToken(refreshToken, stored.tokenHash);
    if (match) {
      tokenValid = true;
      break;
    }
  }

  if (!tokenValid) {
    throw createError('Refresh token has been revoked or expired.', HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await userRepo.findUserById(payload.userId);
  if (!user) {
    throw createError('User account no longer exists.', HTTP_STATUS.UNAUTHORIZED);
  }

  const newAccessToken = jwtUtil.generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    accountType: user.accountType || (user.role === 'admin' ? 'admin' : 'customer'),
  });

  return { accessToken: newAccessToken };
}

export async function changePassword(userId: string, input: ChangePasswordInput, ctx?: AuthRequestContext) {
  const user = await userRepo.findUserWithPasswordById(userId);
  if (!user) throw createError('User not found.', HTTP_STATUS.NOT_FOUND);

  const valid = await comparePassword(input.currentPassword, user.passwordHash);
  if (!valid) throw createError('Current password is incorrect.', HTTP_STATUS.BAD_REQUEST);

  const newHash = await hashPassword(input.newPassword);
  await userRepo.updateUser(userId, { passwordHash: newHash });
  await userRepo.deleteAllUserRefreshTokens(userId);

  await logActivity({
    userId,
    action: 'PASSWORD_CHANGED',
    metadata: { by: 'user_settings' },
    ipAddress: ctx?.ip,
  });

  await createNotification({
    userId,
    title: 'Security Alert: Password Changed',
    message: 'Your account password was successfully updated. If you did not make this change, contact support immediately.',
    type: 'password_changed',
  });
}

export async function generatePasswordResetToken(email: string, ctx?: AuthRequestContext): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  const user = await userRepo.findUserByEmail(email);
  if (user) {
    await prisma.passwordResetToken.deleteMany({ where: { email } });
    await prisma.passwordResetToken.create({
      data: { email, tokenHash, expiresAt },
    });
    await logActivity({
      userId: user.id,
      action: 'PASSWORD_RESET_REQUESTED',
      ipAddress: ctx?.ip,
    });
  }

  return rawToken;
}

export async function resetPassword(rawToken: string, newPassword: string, ctx?: AuthRequestContext) {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const resetRecord = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
    throw createError('Reset token is invalid or has expired.', HTTP_STATUS.BAD_REQUEST);
  }

  const user = await userRepo.findUserByEmail(resetRecord.email);
  if (!user) throw createError('User not found.', HTTP_STATUS.NOT_FOUND);

  const passwordHash = await hashPassword(newPassword);
  await userRepo.updateUser(user.id, { passwordHash });
  await prisma.passwordResetToken.update({ where: { tokenHash }, data: { used: true } });
  await userRepo.deleteAllUserRefreshTokens(user.id);

  await logActivity({
    userId: user.id,
    action: 'PASSWORD_RESET_COMPLETED',
    ipAddress: ctx?.ip,
  });

  await createNotification({
    userId: user.id,
    title: 'Password Successfully Reset',
    message: 'Your password has been reset using a secure token recovery link.',
    type: 'password_changed',
  });
}
