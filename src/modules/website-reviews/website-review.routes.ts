import express from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateZod } from '../../middlewares/validation.middleware';
import {
  createWebsiteReview,
  getApprovedReviews,
  getAllReviews,
  getPendingReviews,
  approveReview,
  rejectReview,
  deleteReview,
} from './website-review.controller';
import { createWebsiteReviewSchema } from './website-review.validation';

const router = express.Router();

// Public routes
router.get('/approved', getApprovedReviews);

// Authenticated user routes
router.post(
  '/',
  authenticate,
  validateZod(createWebsiteReviewSchema),
  createWebsiteReview
);

// Admin only routes
router.get('/all', authenticate, authorize('Admin'), getAllReviews);
router.get('/pending', authenticate, authorize('Admin'), getPendingReviews);
router.patch('/:id/approve', authenticate, authorize('Admin'), approveReview);
router.patch('/:id/reject', authenticate, authorize('Admin'), rejectReview);
router.delete('/:id', authenticate, authorize('Admin'), deleteReview);

export default router;
