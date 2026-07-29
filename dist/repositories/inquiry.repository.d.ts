export declare function createInquiry(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
    inquiryType: string;
    propertyId?: string;
    propertyName?: string;
    datePreference?: string;
    userId?: string;
}): Promise<{
    message: string;
    name: string;
    id: string;
    email: string;
    phone: string;
    createdAt: Date;
    userId: string | null;
    propertyId: string | null;
    inquiryType: import(".prisma/client").$Enums.InquiryType;
    propertyName: string | null;
    datePreference: string | null;
    isRead: boolean;
}>;
export declare function findAllInquiries(page?: number, limit?: number, type?: string): Promise<{
    inquiries: {
        message: string;
        name: string;
        id: string;
        email: string;
        phone: string;
        createdAt: Date;
        userId: string | null;
        propertyId: string | null;
        inquiryType: import(".prisma/client").$Enums.InquiryType;
        propertyName: string | null;
        datePreference: string | null;
        isRead: boolean;
    }[];
    meta: import("../types").PaginationMeta;
}>;
export declare function findInquiriesByUserId(userId: string): Promise<{
    message: string;
    name: string;
    id: string;
    email: string;
    phone: string;
    createdAt: Date;
    userId: string | null;
    propertyId: string | null;
    inquiryType: import(".prisma/client").$Enums.InquiryType;
    propertyName: string | null;
    datePreference: string | null;
    isRead: boolean;
}[]>;
export declare function markInquiryRead(id: string): Promise<{
    message: string;
    name: string;
    id: string;
    email: string;
    phone: string;
    createdAt: Date;
    userId: string | null;
    propertyId: string | null;
    inquiryType: import(".prisma/client").$Enums.InquiryType;
    propertyName: string | null;
    datePreference: string | null;
    isRead: boolean;
}>;
export declare function createServiceRequest(data: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    details?: string;
    serviceType: string;
}): Promise<{
    name: string;
    id: string;
    email: string;
    phone: string;
    createdAt: Date;
    address: string | null;
    details: string | null;
    isRead: boolean;
    serviceType: import(".prisma/client").$Enums.ServiceType;
}>;
export declare function findAllServiceRequests(page?: number, limit?: number): Promise<{
    requests: {
        name: string;
        id: string;
        email: string;
        phone: string;
        createdAt: Date;
        address: string | null;
        details: string | null;
        isRead: boolean;
        serviceType: import(".prisma/client").$Enums.ServiceType;
    }[];
    meta: import("../types").PaginationMeta;
}>;
export declare function findServiceRequestsByEmail(email: string): Promise<{
    name: string;
    id: string;
    email: string;
    phone: string;
    createdAt: Date;
    address: string | null;
    details: string | null;
    isRead: boolean;
    serviceType: import(".prisma/client").$Enums.ServiceType;
}[]>;
//# sourceMappingURL=inquiry.repository.d.ts.map