export interface CreateNotificationInput {
    userId: string;
    title: string;
    message: string;
    type: string;
    metadata?: Record<string, any>;
}
export declare function createNotification(input: CreateNotificationInput): Promise<void>;
export declare function getUnreadNotifications(userId: string, limit?: number): Promise<{
    message: string;
    id: string;
    createdAt: Date;
    userId: string;
    title: string;
    type: string;
    isRead: boolean;
    metadata: import("@prisma/client/runtime/library").JsonValue | null;
}[]>;
export declare function getAllNotifications(userId: string, limit?: number): Promise<{
    message: string;
    id: string;
    createdAt: Date;
    userId: string;
    title: string;
    type: string;
    isRead: boolean;
    metadata: import("@prisma/client/runtime/library").JsonValue | null;
}[]>;
export declare function markAsRead(notificationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare function markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
//# sourceMappingURL=notification.service.d.ts.map