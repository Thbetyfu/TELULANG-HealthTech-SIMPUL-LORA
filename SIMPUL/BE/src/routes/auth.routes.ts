import { Router } from 'express';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { validateSchema } from '../middleware/zod-validation.middleware';
import { LoginRequestSchema } from '../schemas/auth.schema';

const router = Router();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post('/login', validateSchema(LoginRequestSchema), authController.login);

export default router;
