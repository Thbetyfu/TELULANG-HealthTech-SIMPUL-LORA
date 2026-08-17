import { Router } from 'express';
import { StockRepository } from '../repositories/stock.repository';
import { WebSocketService } from '../services/websocket.service';
import { SatusehatIngestionService } from '../services/satusehat-ingestion.service';
import { SatusehatController } from '../controllers/satusehat.controller';
import { validateSchema } from '../middleware/zod-validation.middleware';
import { SatusehatDispenseEventSchema } from '../schemas/satusehat.schema';

const router = Router();

const stockRepository = new StockRepository();
const webSocketService = WebSocketService.getInstance();
const ingestionService = new SatusehatIngestionService(stockRepository, webSocketService);
const satusehatController = new SatusehatController(ingestionService);

router.post(
  '/dispense-event',
  validateSchema(SatusehatDispenseEventSchema),
  satusehatController.handleDispenseWebhook
);

export default router;
