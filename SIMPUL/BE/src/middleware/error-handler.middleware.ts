import { Request, Response, NextFunction } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[SIMPUL Error Handler]:', err);

  const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    status: 'error',
    message: err.message || getReasonPhrase(statusCode),
    timestamp: new Date().toISOString()
  });
};
