import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import {
  sendMessageRequest,
  getMessageRequests,
  acceptMessageRequest,
  rejectMessageRequest,
  cancelMessageRequest,
  getConversations,
  getConversation,
  checkConversation,
} from './conversation.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Send message request
router.post('/request', sendMessageRequest);

// Get pending message requests (received by current user)
router.get('/requests', getMessageRequests);

// Check if conversation exists with a specific user (must be before :id routes)
router.get('/check/:userId', checkConversation);

// Cancel message request (sent by current user)
router.delete('/cancel/:receiverId', cancelMessageRequest);

// Get all accepted conversations
router.get('/', getConversations);

// Get specific conversation
router.get('/:id', getConversation);

// Accept message request
router.patch('/:id/accept', acceptMessageRequest);

// Reject message request
router.patch('/:id/reject', rejectMessageRequest);

export default router;
