import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import {
  createComment,
  getEventComments,
  updateComment,
  deleteComment,
  addReaction,
  removeReaction,
} from './comment.controller';

const router = Router();

// Comment routes
router.post('/', authenticate, createComment);
router.get('/event/:eventId', getEventComments);
router.patch('/:id', authenticate, updateComment);
router.delete('/:id', authenticate, deleteComment);

// Reaction routes
router.post('/:id/reaction', authenticate, addReaction);
router.delete('/:id/reaction', authenticate, removeReaction);

export default router;
