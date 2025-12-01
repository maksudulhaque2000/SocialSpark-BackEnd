import { Router } from 'express';
import {
  getUserById,
  updateUser,
  getUserEvents,
  getUserHostedEvents,
  getTopHosts,
  getHostProfile,
} from './user.controller';
import { updateUserValidation } from './user.validation';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';

const router = Router();

// Public routes
router.get('/top-hosts', getTopHosts);
router.get('/:id', getUserById);
router.get('/:id/profile', getHostProfile); // Host profile with stats

// Protected routes
router.patch('/:id', authenticate, upload.single('profileImage'), updateUserValidation, validate, updateUser);
router.get('/:id/events', authenticate, getUserEvents);
router.get('/:id/hosted-events', authenticate, getUserHostedEvents);

export default router;
