import { Router } from 'express';
import {
  createReview,
  getHostReviews,
  getEventReviews,
  updateReview,
  deleteReview,
  addReviewReaction,
  removeReviewReaction,
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

// Reaction routes
router.post('/:id/reaction', authenticate, addReviewReaction);
router.delete('/:id/reaction', authenticate, removeReviewReaction);

export default router;
