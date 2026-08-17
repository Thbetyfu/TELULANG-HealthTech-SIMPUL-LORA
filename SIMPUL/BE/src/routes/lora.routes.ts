import { Router } from 'express';
import { LoraController } from '../controllers/lora.controller';
import { LoraService } from '../services/lora.service';
import { LoraRepository } from '../repositories/lora.repository';
import { validateBody } from '../middleware/validation.middleware';
import { submitPodSchema } from '../schemas/lora.schema';

const router = Router();
const repo = new LoraRepository();
const service = new LoraService(repo);
const controller = new LoraController(service);

router.get('/tasks', controller.listTasks);
router.post('/pod', validateBody(submitPodSchema), controller.submitPod);

export default router;
