export declare function createProfessional(data: {
    name: string;
    email: string;
    phone: string;
    company: string;
    reraId?: string;
    experience: number;
    role: string;
    userId?: string;
}): Promise<{
    role: import(".prisma/client").$Enums.ProfessionalRole;
    name: string;
    id: string;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string | null;
    reraId: string | null;
    status: import(".prisma/client").$Enums.ProfessionalStatus;
    adminNote: string | null;
    company: string;
    experience: number;
}>;
export declare function findProfessionalByEmail(email: string): Promise<{
    role: import(".prisma/client").$Enums.ProfessionalRole;
    name: string;
    id: string;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string | null;
    reraId: string | null;
    status: import(".prisma/client").$Enums.ProfessionalStatus;
    adminNote: string | null;
    company: string;
    experience: number;
} | null>;
export declare function findAllProfessionals(page?: number, limit?: number, status?: string): Promise<{
    professionals: {
        role: import(".prisma/client").$Enums.ProfessionalRole;
        name: string;
        id: string;
        email: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        reraId: string | null;
        status: import(".prisma/client").$Enums.ProfessionalStatus;
        adminNote: string | null;
        company: string;
        experience: number;
    }[];
    meta: import("../types").PaginationMeta;
}>;
export declare function updateProfessionalStatus(id: string, status: string, adminNote?: string): Promise<{
    role: import(".prisma/client").$Enums.ProfessionalRole;
    name: string;
    id: string;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string | null;
    reraId: string | null;
    status: import(".prisma/client").$Enums.ProfessionalStatus;
    adminNote: string | null;
    company: string;
    experience: number;
}>;
//# sourceMappingURL=professional.repository.d.ts.map