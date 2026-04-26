import { type Request, type Response, type NextFunction, type RequestHandler } from 'express';
import { ZodType, ZodError } from 'zod';

export const validateBody = (schema: ZodType) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'Invalid request data',
          errors: err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      next(err);
    }
  };