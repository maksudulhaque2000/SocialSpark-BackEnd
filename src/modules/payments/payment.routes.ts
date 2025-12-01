import { Router } from 'express';
import express from 'express';
import {
  createPaymentIntent,
  handleWebhook,
  getUserPayments,
  getHostRevenue,
  confirmPaymentAndJoin,
} from './payment.controller';
import { createPaymentIntentValidation } from './payment.validation';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// Webhook route (must be before express.json() middleware)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

// Protected routes
router.post(
  '/create-intent',
  authenticate,
  createPaymentIntentValidation,
  validate,
  createPaymentIntent
);

router.post('/confirm-and-join', authenticate, confirmPaymentAndJoin);

router.get('/user/:userId', authenticate, getUserPayments);
router.get('/host/:hostId/revenue', authenticate, getHostRevenue);

export default router;
