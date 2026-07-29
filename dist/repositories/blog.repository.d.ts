import { Prisma } from '@prisma/client';
export declare function findBlogs(page?: number, limit?: number, category?: string): Promise<{
    blogs: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        image: string;
        category: import(".prisma/client").$Enums.BlogCategory;
        author: string;
        readTime: string;
        published: boolean;
        publishedAt: Date;
    }[];
    meta: import("../types").PaginationMeta;
}>;
export declare function findBlogById(id: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    image: string;
    category: import(".prisma/client").$Enums.BlogCategory;
    author: string;
    readTime: string;
    published: boolean;
    publishedAt: Date;
} | null>;
export declare function createBlog(data: {
    category: string;
    title: string;
    description: string;
    author: string;
    readTime: string;
    image: string;
}): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    image: string;
    category: import(".prisma/client").$Enums.BlogCategory;
    author: string;
    readTime: string;
    published: boolean;
    publishedAt: Date;
}>;
export declare function updateBlog(id: string, data: Partial<{
    category: string;
    title: string;
    description: string;
    author: string;
    readTime: string;
    image: string;
    published: boolean;
}>): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    image: string;
    category: import(".prisma/client").$Enums.BlogCategory;
    author: string;
    readTime: string;
    published: boolean;
    publishedAt: Date;
}>;
export declare function deleteBlog(id: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    image: string;
    category: import(".prisma/client").$Enums.BlogCategory;
    author: string;
    readTime: string;
    published: boolean;
    publishedAt: Date;
}>;
export declare function findInteriors(roomType?: string): Promise<{
    specsJson: string[];
    id: string;
    createdAt: Date;
    title: string;
    description: string;
    image: string;
    roomType: import(".prisma/client").$Enums.RoomType;
    active: boolean;
}[]>;
export declare function findInteriorById(id: string): Promise<{
    id: string;
    createdAt: Date;
    title: string;
    description: string;
    image: string;
    roomType: import(".prisma/client").$Enums.RoomType;
    specsJson: Prisma.JsonValue;
    active: boolean;
} | null>;
//# sourceMappingURL=blog.repository.d.ts.map