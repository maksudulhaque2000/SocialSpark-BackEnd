import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import {
  sendMessage,
  getMessages,
  markMessagesAsRead,
  getUnreadCount,
} from './message.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get unread message count (must be before :conversationId routes)
router.get('/unread/count', getUnreadCount);

// Send a message
router.post('/', sendMessage);

// Get messages in a conversation
router.get('/:conversationId', getMessages);

// Mark messages as read in a conversation
router.patch('/:conversationId/read', markMessagesAsRead);

export default router;
