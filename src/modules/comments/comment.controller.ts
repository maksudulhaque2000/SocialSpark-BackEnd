import { Response } from 'express';
import { AuthRequest } from '../../types';
import Comment from './comment.model';
import Event from '../events/event.model';
import { sendSuccess, sendError } from '../../utils/response.util';
import { getPaginationParams, getPaginationResult } from '../../utils/pagination.util';

// Create comment on event
export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId, comment } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      sendError(res, 404, 'Event not found');
      return;
    }

    // Create comment
    const newComment = await Comment.create({
      userId: req.user!.id,
      eventId,
      comment,
    });

    const populatedComment = await Comment.findById(newComment._id)
      .populate('userId', 'name email profileImage')
      .populate('eventId', 'title');

    sendSuccess(res, 201, 'Comment created successfully', { comment: populatedComment });
  } catch (error: unknown) {
    console.error('Create comment error:', error);
    sendError(res, 500, 'Failed to create comment');
  }
};

// Get comments for an event
export const getEventComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { page, limit } = req.query;

    const paginationParams = getPaginationParams({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    const comments = await Comment.find({ eventId })
      .populate('userId', 'name email profileImage')
      .populate('reactions.userId', 'name profileImage')
      .sort(paginationParams.sort)
      .skip(paginationParams.skip)
      .limit(paginationParams.limit);

    const totalComments = await Comment.countDocuments({ eventId });
    const pagination = getPaginationResult(
      paginationParams.page,
      paginationParams.limit,
      totalComments
    );

    sendSuccess(res, 200, 'Comments retrieved successfully', { comments, pagination });
  } catch (error: unknown) {
    console.error('Get event comments error:', error);
    sendError(res, 500, 'Failed to get comments');
  }
};

// Update comment
export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const existingComment = await Comment.findById(id);
    if (!existingComment) {
      sendError(res, 404, 'Comment not found');
      return;
    }

    // Check if user owns the comment
    if (existingComment.userId.toString() !== req.user!.id) {
      sendError(res, 403, 'You can only update your own comments');
      return;
    }

    existingComment.comment = comment;
    await existingComment.save();

    const updatedComment = await Comment.findById(id)
      .populate('userId', 'name email profileImage')
      .populate('reactions.userId', 'name profileImage');

    sendSuccess(res, 200, 'Comment updated successfully', { comment: updatedComment });
  } catch (error: unknown) {
    console.error('Update comment error:', error);
    sendError(res, 500, 'Failed to update comment');
  }
};

// Delete comment
export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      sendError(res, 404, 'Comment not found');
      return;
    }

    // Check if user owns the comment or is admin
    if (comment.userId.toString() !== req.user!.id && req.user?.role !== 'Admin') {
      sendError(res, 403, 'You can only delete your own comments');
      return;
    }

    await Comment.findByIdAndDelete(id);

    sendSuccess(res, 200, 'Comment deleted successfully', null);
  } catch (error: unknown) {
    console.error('Delete comment error:', error);
    sendError(res, 500, 'Failed to delete comment');
  }
};

// Add/Update reaction to comment
export const addReaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!['like', 'love', 'wow', 'sad', 'angry'].includes(type)) {
      sendError(res, 400, 'Invalid reaction type');
      return;
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      sendError(res, 404, 'Comment not found');
      return;
    }

    // Check if user already reacted
    const existingReactionIndex = comment.reactions.findIndex(
      (r) => r.userId.toString() === req.user!.id
    );

    if (existingReactionIndex > -1) {
      // Update existing reaction
      comment.reactions[existingReactionIndex].type = type;
    } else {
      // Add new reaction
      comment.reactions.push({
        userId: req.user!.id as any,
        type,
      });
    }

    await comment.save();

    const updatedComment = await Comment.findById(id)
      .populate('userId', 'name email profileImage')
      .populate('reactions.userId', 'name profileImage');

    sendSuccess(res, 200, 'Reaction added successfully', { comment: updatedComment });
  } catch (error: unknown) {
    console.error('Add reaction error:', error);
    sendError(res, 500, 'Failed to add reaction');
  }
};

// Remove reaction from comment
export const removeReaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      sendError(res, 404, 'Comment not found');
      return;
    }

    // Remove user's reaction
    comment.reactions = comment.reactions.filter(
      (r) => r.userId.toString() !== req.user!.id
    );

    await comment.save();

    const updatedComment = await Comment.findById(id)
      .populate('userId', 'name email profileImage')
      .populate('reactions.userId', 'name profileImage');

    sendSuccess(res, 200, 'Reaction removed successfully', { comment: updatedComment });
  } catch (error: unknown) {
    console.error('Remove reaction error:', error);
    sendError(res, 500, 'Failed to remove reaction');
  }
};
