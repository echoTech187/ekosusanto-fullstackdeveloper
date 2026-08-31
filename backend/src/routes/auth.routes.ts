import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const controller = new AuthController();

router.post('/register', validate(registerSchema), (req, res, next) => controller.register(req, res, next));
router.post('/login', validate(loginSchema), (req, res, next) => controller.login(req, res, next));
router.get('/me', authenticateToken, (req, res, next) => controller.me(req, res, next));

export default router;
