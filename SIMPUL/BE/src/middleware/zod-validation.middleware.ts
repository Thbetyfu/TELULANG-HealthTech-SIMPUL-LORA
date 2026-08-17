import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const validateSchema = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.name === 'ZodError') {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          status: 'error',
          message: 'Validation failed',
          errors: (error.errors || []).map((err: any) => ({
            field: Array.isArray(err.path) ? err.path.join('.') : String(err.path),
            message: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};
