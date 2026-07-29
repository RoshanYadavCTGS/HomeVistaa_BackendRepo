import { Request } from 'express';
export interface RecordActivityInput {
    userId?: string;
    action: string;
    entityType?: string;
    entityId?: string;
    metadata?: Record<string, any>;
    req?: Request;
    ipAddress?: string;
    browser?: string;
    device?: string;
}
/**
 * Parses User-Agent string for Browser and Device identification
 */
export declare function parseUserAgent(ua?: string): {
    browser: string;
    device: string;
};
/**
 * Centralized activity log creation tracking user, action, IP, browser, and device
 */
export declare function logActivity(input: RecordActivityInput): Promise<void>;
export declare function getActivityLogs(limit?: number, userId?: string, action?: string): Promise<({
    user: {
        role: import(".prisma/client").$Enums.UserRole;
        name: string;
        email: string;
        avatarUrl: string | null;
    } | null;
} & {
    id: string;
    createdAt: Date;
    device: string | null;
    browser: string | null;
    ipAddress: string | null;
    userId: string | null;
    action: string;
    entityType: string | null;
    entityId: string | null;
    metadata: import("@prisma/client/runtime/library").JsonValue | null;
})[]>;
//# sourceMappingURL=activityLog.service.d.ts.map