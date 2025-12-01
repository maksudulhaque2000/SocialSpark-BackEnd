import { Router } from 'express';
import {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  updateUserRole,
  getAllEvents,
  approveEvent,
  rejectEvent,
  forceDeleteEvent,
  getDashboardStats,
  getPendingEvents,
} from './admin.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// All routes are protected and admin-only
router.use(authenticate);
router.use(authorize('Admin'));

// Dashboard statistics
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Event management
router.get('/events', getAllEvents);
router.get('/events/pending', getPendingEvents);
router.patch('/events/:id/approve', approveEvent);
router.patch('/events/:id/reject', rejectEvent);
router.delete('/events/:id', forceDeleteEvent);

export default router;
