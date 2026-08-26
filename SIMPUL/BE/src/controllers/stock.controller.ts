import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StockReconciliationService } from '../services/stock-reconciliation.service';
import { CreateStockReconciliationInput } from '../schemas/stock.schema';

export class StockController {
  constructor(private stockService: StockReconciliationService) {}

  reconcile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: CreateStockReconciliationInput = req.body;
      const result = await this.stockService.processReconciliation(input);

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'Stock reconciled successfully.',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  listDiscrepancies = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const discrepancies = await this.stockService.getActiveDiscrepancies();
      res.status(StatusCodes.OK).json({
        status: 'success',
        count: discrepancies.length,
        data: discrepancies
      });
    } catch (error) {
      next(error);
    }
  };

  listPublicFacilities = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const facilities = await this.stockService.getPublicMapFacilities();
      res.status(StatusCodes.OK).json({
        status: 'success',
        count: facilities.length,
        data: facilities
      });
    } catch (error) {
      next(error);
    }
  };
}
