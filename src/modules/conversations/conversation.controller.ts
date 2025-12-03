import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../../types';
import Conversation from './conversation.model';
import Message from '../messages/message.model';

// Send message request
export const sendMessageRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user?.id;

    if (!senderId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Validate receiverId
    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      res.status(400).json({ success: false, message: 'Invalid receiver ID' });
      return;
    }

    // Cannot send request to yourself
    if (senderId === receiverId) {
      res.status(400).json({ success: false, message: 'Cannot send message request to yourself' });
      return;
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      $or: [
        { requestedBy: senderId, requestedTo: receiverId },
        { requestedBy: receiverId, requestedTo: senderId },
      ],
    });

    if (existingConversation) {
      if (existingConversation.status === 'pending') {
        res.status(400).json({ success: false, message: 'Message request already sent' });
        return;
      }
      if (existingConversation.status === 'accepted') {
        res.status(400).json({ success: false, message: 'Conversation already exists' });
        return;
      }
      // If rejected, allow creating new request by updating existing one
      existingConversation.status = 'pending';
      existingConversation.requestedBy = new mongoose.Types.ObjectId(senderId);
      existingConversation.requestedTo = new mongoose.Types.ObjectId(receiverId);
      existingConversation.participants = [
        new mongoose.Types.ObjectId(senderId),
        new mongoose.Types.ObjectId(receiverId),
      ];
      await existingConversation.save();

      res.status(200).json({
        success: true,
        message: 'Message request sent successfully',
        data: { conversation: existingConversation },
      });
      return;
    }

    // Create new conversation request
    const conversation = await Conversation.create({
      participants: [senderId, receiverId],
      requestedBy: senderId,
      requestedTo: receiverId,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Message request sent successfully',
      data: { conversation },
    });
  } catch (error) {
    console.error('Send message request error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message request' });
  }
};

// Get pending message requests
export const getMessageRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const requests = await Conversation.find({
      requestedTo: userId,
      status: 'pending',
    })
      .populate('requestedBy', 'name email profileImage role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { requests },
    });
  } catch (error) {
    console.error('Get message requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch message requests' });
  }
};

// Accept message request
export const acceptMessageRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found' });
      return;
    }

    // Only the recipient can accept
    if (conversation.requestedTo.toString() !== userId) {
      res.status(403).json({ success: false, message: 'Not authorized to accept this request' });
      return;
    }

    conversation.status = 'accepted';
    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Message request accepted',
      data: { conversation },
    });
  } catch (error) {
    console.error('Accept message request error:', error);
    res.status(500).json({ success: false, message: 'Failed to accept message request' });
  }
};

// Reject message request
export const rejectMessageRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found' });
      return;
    }

    // Only the recipient can reject
    if (conversation.requestedTo.toString() !== userId) {
      res.status(403).json({ success: false, message: 'Not authorized to reject this request' });
      return;
    }

    conversation.status = 'rejected';
    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Message request rejected',
      data: { conversation },
    });
  } catch (error) {
    console.error('Reject message request error:', error);
    res.status(500).json({ success: false, message: 'Failed to reject message request' });
  }
};

// Cancel message request (by sender)
export const cancelMessageRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { receiverId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const conversation = await Conversation.findOne({
      requestedBy: userId,
      requestedTo: receiverId,
      status: 'pending',
    });

    if (!conversation) {
      res.status(404).json({ success: false, message: 'Message request not found' });
      return;
    }

    await conversation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message request cancelled',
    });
  } catch (error) {
    console.error('Cancel message request error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel message request' });
  }
};

// Get all accepted conversations
export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const conversations = await Conversation.find({
      participants: userId,
      status: 'accepted',
    })
      .populate('participants', 'name email profileImage role')
      .sort({ lastMessageAt: -1, createdAt: -1 });

    // Get last message and unread count for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({ conversationId: conv._id })
          .sort({ createdAt: -1 })
          .select('content createdAt senderId');

        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          receiverId: userId,
          isRead: false,
        });

        return {
          ...conv.toObject(),
          lastMessage,
          unreadCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: { conversations: conversationsWithDetails },
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
  }
};

// Get specific conversation
export const getConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const conversation = await Conversation.findById(id)
      .populate('participants', 'name email profileImage role');

    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found' });
      return;
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      (p: any) => p._id.toString() === userId
    );

    if (!isParticipant) {
      res.status(403).json({ success: false, message: 'Not authorized to view this conversation' });
      return;
    }

    res.status(200).json({
      success: true,
      data: { conversation },
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch conversation' });
  }
};

// Check if conversation exists with a specific user
export const checkConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId: otherUserId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    res.status(200).json({
      success: true,
      data: {
        exists: !!conversation,
        conversation: conversation || null,
      },
    });
  } catch (error) {
    console.error('Check conversation error:', error);
    res.status(500).json({ success: false, message: 'Failed to check conversation' });
  }
};
