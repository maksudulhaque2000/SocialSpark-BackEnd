import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getCategories,
} from './event.controller';
import { createEventValidation, updateEventValidation } from './event.validation';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/categories', getCategories);
router.get('/:id', getEventById);

// Protected routes - Host/Admin only
router.post(
  '/',
  authenticate,
  authorize('Host', 'Admin'),
  upload.single('bannerImage'),
  createEventValidation,
  validate,
  createEvent
);

router.patch(
  '/:id',
  authenticate,
  upload.single('bannerImage'),
  updateEventValidation,
  validate,
  updateEvent
);

router.delete('/:id', authenticate, deleteEvent);

// Protected routes - All authenticated users
router.post('/:id/join', authenticate, joinEvent);
router.post('/:id/leave', authenticate, leaveEvent);

export default router;
