import { Router } from 'express';
import {
  createReview,
  getHostReviews,
  getEventReviews,
  updateReview,
  deleteReview,
} from './review.controller';
import { createReviewValidation, updateReviewValidation } from './review.validation';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/host/:hostId', getHostReviews);
router.get('/event/:eventId', getEventReviews);

// Protected routes
router.post('/', authenticate, createReviewValidation, validate, createReview);
router.patch('/:id', authenticate, updateReviewValidation, validate, updateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
