import * as userRepo from '../repositories/user.repository';
import { RegisterInput, LoginInput, ChangePasswordInput } from '../validators/auth.validator';
export interface AuthRequestContext {
    ip?: string;
    userAgent?: string;
}
export declare function register(input: RegisterInput, ctx?: AuthRequestContext): Promise<{
    user: userRepo.SafeUser;
    accessToken: string;
    refreshToken: string;
}>;
export declare function login(input: LoginInput, ctx?: AuthRequestContext): Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        emailVerified: boolean;
        avatarUrl: string | null;
        phone: string | null;
        accountType: string;
        createdAt: Date;
        updatedAt: Date;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare function logout(refreshToken: string, ctx?: AuthRequestContext): Promise<void>;
export declare function refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
}>;
export declare function changePassword(userId: string, input: ChangePasswordInput, ctx?: AuthRequestContext): Promise<void>;
export declare function generatePasswordResetToken(email: string, ctx?: AuthRequestContext): Promise<string>;
export declare function resetPassword(rawToken: string, newPassword: string, ctx?: AuthRequestContext): Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map