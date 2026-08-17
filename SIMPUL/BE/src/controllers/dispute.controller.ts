import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DisputeService } from '../services/dispute.service';

export class DisputeController {
  constructor(private disputeService: DisputeService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.disputeService.submitDispute(req.body);
      res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'Laporan dispute publik berhasil terverifikasi dan dikirim ke Inspektorat Kemenkes.',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.disputeService.getDisputes();
      res.status(StatusCodes.OK).json({
        status: 'success',
        count: result.length,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
