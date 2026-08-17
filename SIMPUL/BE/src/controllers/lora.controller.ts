import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LoraService } from '../services/lora.service';

export class LoraController {
  constructor(private loraService: LoraService) {}

  listTasks = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loraService.listTasks();
      res.status(StatusCodes.OK).json({
        status: 'success',
        count: result.length,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  submitPod = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loraService.submitPod(req.body);
      res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Proof of Delivery (PoD) & TTE berhasil diverifikasi dan disimpan ke Cloud PDN.',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
