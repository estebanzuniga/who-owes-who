import { type Request, type Response, type NextFunction } from 'express';

interface AppError extends Error {
    status?: number
}

export function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err);
    const status = err.status ?? 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
}