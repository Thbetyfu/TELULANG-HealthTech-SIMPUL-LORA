import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SatusehatIngestionService } from '../services/satusehat-ingestion.service';
import { SatusehatDispenseEventInput } from '../schemas/satusehat.schema';

export class SatusehatController {
  constructor(private ingestionService: SatusehatIngestionService) {}

  handleDispenseWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: SatusehatDispenseEventInput = req.body;
      const result = await this.ingestionService.processDispenseEvent(input);

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'SATUSEHAT MedicationDispense event ingested & reconciled.',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
