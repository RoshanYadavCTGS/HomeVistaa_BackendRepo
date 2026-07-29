import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendBadRequest } from '../utils/response';
import { ValidationError } from '../types';

type RequestPart = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, part: RequestPart = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const errors: ValidationError[] = (result.error as ZodError).errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      sendBadRequest(res, 'Validation failed', errors);
      return;
    }

    // Replace request part with sanitized/coerced data
    (req as any)[part] = result.data;
    next();
  };
}
