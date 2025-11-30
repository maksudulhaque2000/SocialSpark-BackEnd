import { Router } from 'express';
import { register, login, socialLogin, getCurrentUser } from './auth.controller';
import { registerValidation, loginValidation, socialLoginValidation } from './auth.validation';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/social-login', socialLoginValidation, validate, socialLogin);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router;
