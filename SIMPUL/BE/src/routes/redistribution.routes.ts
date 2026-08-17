import { Router } from 'express';
import { RedistributionController } from '../controllers/redistribution.controller';
import { RedistributionService } from '../services/redistribution.service';
import { LoraRepository } from '../repositories/lora.repository';

const router = Router();
const loraRepo = new LoraRepository();
const service = new RedistributionService(loraRepo);
const controller = new RedistributionController(service);

router.get('/', controller.getRecommendations);
router.post('/dispatch', controller.dispatchTask);

export default router;
