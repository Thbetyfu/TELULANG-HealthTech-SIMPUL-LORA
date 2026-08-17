import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'Validasi input gagal',
          errors: error.errors.map(err => ({ field: err.path.join('.'), message: err.message }))
        });
        return;
      }
      next(error);
    }
  };
};
