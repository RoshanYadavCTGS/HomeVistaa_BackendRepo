import { Request, Response, NextFunction } from 'express';
export declare function getTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getTransactionById(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getTransactionPayments(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getTransactionDocuments(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getTransactionTimeline(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createTransaction(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=transactions.controller.d.ts.map