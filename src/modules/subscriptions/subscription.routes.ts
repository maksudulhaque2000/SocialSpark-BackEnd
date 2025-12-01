import { Router } from 'express';
import {
  getSubscriptionPlans,
  getUserSubscription,
  subscribeToPlan,
  confirmSubscriptionPayment,
  cancelSubscription,
  upsertSubscriptionPlan,
  getAllSubscriptions,
} from './subscription.controller';
import {
  subscribeToPlanValidation,
  confirmSubscriptionPaymentValidation,
  upsertSubscriptionPlanValidation,
} from './subscription.validation';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/plans', getSubscriptionPlans);

// Protected routes
router.get('/my-subscription', authenticate, getUserSubscription);
router.post('/subscribe', authenticate, subscribeToPlanValidation, validate, subscribeToPlan);
router.post('/confirm-subscription', authenticate, confirmSubscriptionPaymentValidation, validate, confirmSubscriptionPayment);
router.post('/cancel', authenticate, cancelSubscription);

// Admin routes
router.post('/plans/upsert', authenticate, upsertSubscriptionPlanValidation, validate, upsertSubscriptionPlan);
router.get('/all', authenticate, getAllSubscriptions);

export default router;
