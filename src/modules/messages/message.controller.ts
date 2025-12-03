import { Response } from 'express';
import { AuthRequest } from '../../types';
import Message from './message.model';
import Conversation from '../conversations/conversation.model';

// Send a message
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user?.id;

    if (!senderId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Validate input
    if (!conversationId || !content || !content.trim()) {
      res.status(400).json({ success: false, message: 'Conversation ID and message content are required' });
      return;
    }

    // Check if conversation exists and is accepted
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found' });
      return;
    }

    if (conversation.status !== 'accepted') {
      res.status(400).json({ success: false, message: 'Conversation must be accepted before sending messages' });
      return;
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === senderId
    );

    if (!isParticipant) {
      res.status(403).json({ success: false, message: 'Not authorized to send messages in this conversation' });
      return;
    }

    // Find receiver (the other participant)
    const receiverId = conversation.participants.find(
      (p) => p.toString() !== senderId
    );

    if (!receiverId) {
      res.status(400).json({ success: false, message: 'Receiver not found' });
      return;
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId,
      receiverId,
      content: content.trim(),
      isRead: false,
    });

    // Update conversation's lastMessageAt
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Populate sender info
    await message.populate('senderId', 'name email profileImage role');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message },
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

// Get messages in a conversation
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found' });
      return;
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId
    );

    if (!isParticipant) {
      res.status(403).json({ success: false, message: 'Not authorized to view these messages' });
      return;
    }

    // Get messages
    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name email profileImage role')
      .populate('receiverId', 'name email profileImage role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments({ conversationId });

    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
        },
      },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Mark all unread messages in this conversation as read
    await Message.updateMany(
      {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark messages as read' });
  }
};

// Get unread message count
export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const unreadCount = await Message.countDocuments({
      receiverId: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch unread count' });
  }
};
