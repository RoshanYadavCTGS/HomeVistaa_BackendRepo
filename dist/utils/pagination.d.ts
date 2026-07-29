import { PaginationMeta, PaginationParams } from '../types';
export declare function parsePagination(query: {
    page?: unknown;
    limit?: unknown;
}): PaginationParams;
export declare function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta;
//# sourceMappingURL=pagination.d.ts.map