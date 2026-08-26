import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../services/auth.service';
import { LoginRequestInput } from '../schemas/auth.schema';

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as LoginRequestInput;
      const session = await this.authService.login(input);
      res.status(StatusCodes.OK).json({
        status: 'success',
        data: session
      });
    } catch (error) {
      const err = error as Error & { statusCode?: number };
      if (err.statusCode === 401) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: 'error',
          message: err.message
        });
        return;
      }
      next(error);
    }
  };
}
