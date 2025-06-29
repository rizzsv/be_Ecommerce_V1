import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../config/custom.config'; // sesuaikan path

export const globalErrorHandler = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
