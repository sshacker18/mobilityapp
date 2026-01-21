import { Router } from 'express';
import * as controller from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// OTP-based (dev) endpoints
router.post('/request-otp', controller.requestOtp);
router.post('/verify-otp', controller.verifyOtp);

// legacy username login
router.post('/login', controller.login);
router.get('/me', authMiddleware, controller.me);

export default router;
