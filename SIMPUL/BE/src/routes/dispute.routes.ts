import { Router } from 'express';
import { DisputeController } from '../controllers/dispute.controller';
import { DisputeService } from '../services/dispute.service';
import { DisputeRepository } from '../repositories/dispute.repository';
import { validateBody } from '../middleware/validation.middleware';
import { createDisputeSchema } from '../schemas/dispute.schema';

const router = Router();
const repo = new DisputeRepository();
const service = new DisputeService(repo);
const controller = new DisputeController(service);

router.post('/', validateBody(createDisputeSchema), controller.create);
router.get('/', controller.list);

export default router;
