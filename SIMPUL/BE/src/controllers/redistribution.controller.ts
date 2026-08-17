import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RedistributionService } from '../services/redistribution.service';

export class RedistributionController {
  constructor(private redistributionService: RedistributionService) {}

  getRecommendations = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.redistributionService.getRecommendations();
      res.status(StatusCodes.OK).json({
        status: 'success',
        count: data.length,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  dispatchTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.body;
      if (!id) {
        res.status(StatusCodes.BAD_REQUEST).json({ status: 'fail', message: 'ID rekomendasi wajib diisi.' });
        return;
      }
      const result = await this.redistributionService.dispatchRecommendation(id);
      res.status(StatusCodes.OK).json({
        status: 'success',
        message: `Rekomendasi ${id} berhasil didisposisikan ke Kurir LORA (#${result.task.id}).`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
