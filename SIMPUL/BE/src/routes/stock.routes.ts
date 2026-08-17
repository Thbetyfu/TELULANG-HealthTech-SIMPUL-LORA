import { Router } from 'express';
import { StockRepository } from '../repositories/stock.repository';
import { StockReconciliationService } from '../services/stock-reconciliation.service';
import { StockController } from '../controllers/stock.controller';
import { validateSchema } from '../middleware/zod-validation.middleware';
import { CreateStockReconciliationSchema } from '../schemas/stock.schema';

const router = Router();

// Dependency Injection Setup
const stockRepository = new StockRepository();
const stockService = new StockReconciliationService(stockRepository);
const stockController = new StockController(stockService);

router.post(
  '/reconcile',
  validateSchema(CreateStockReconciliationSchema),
  stockController.reconcile
);

router.get(
  '/discrepancies',
  stockController.listDiscrepancies
);

export default router;
