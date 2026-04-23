import { type Request, type Response, type NextFunction, type RequestHandler } from 'express';

export const tryCatch = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }