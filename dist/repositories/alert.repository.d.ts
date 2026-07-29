export declare function createAlert(userId: string, data: {
    title: string;
    description: string;
    filtersJson: Record<string, any>;
}): Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    title: string;
    description: string;
    filtersJson: import("@prisma/client/runtime/library").JsonValue;
}>;
export declare function getAlertsByUser(userId: string): Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    title: string;
    description: string;
    filtersJson: import("@prisma/client/runtime/library").JsonValue;
}[]>;
export declare function deleteAlert(id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare function getAlertById(id: string): Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    title: string;
    description: string;
    filtersJson: import("@prisma/client/runtime/library").JsonValue;
} | null>;
export declare function getAlertsCount(userId: string): Promise<number>;
//# sourceMappingURL=alert.repository.d.ts.map