import { Response } from 'express';
import { AuthRequest } from '../../types';
import Review from './review.model';
import Event from '../events/event.model';
import { sendSuccess, sendError } from '../../utils/response.util';

// Create review
export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId, hostId, rating, comment } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      sendError(res, 404, 'Event not found');
      return;
    }

    // Check if user attended the event
    if (!event.participants.includes(req.user!.id)) {
      sendError(res, 403, 'You can only review events you attended');
      return;
    }

    // Check if event is completed
    if (event.status !== 'completed') {
      sendError(res, 400, 'You can only review completed events');
      return;
    }

    // Check if user already reviewed this event
    const existingReview = await Review.findOne({
      userId: req.user!.id,
      eventId,
    });

    if (existingReview) {
      sendError(res, 400, 'You have already reviewed this event');
      return;
    }

    // Create review
    const review = await Review.create({
      userId: req.user!.id,
      hostId,
      eventId,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name email profileImage')
      .populate('eventId', 'title');

    sendSuccess(res, 201, 'Review created successfully', { review: populatedReview });
  } catch (error: unknown) {
    console.error('Create review error:', error);
    sendError(res, 500, 'Failed to create review');
  }
};

// Get reviews for a host
export const getHostReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { hostId } = req.params;

    const reviews = await Review.find({ hostId })
      .populate('userId', 'name email profileImage')
      .populate('eventId', 'title date')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    sendSuccess(res, 200, 'Reviews retrieved successfully', {
      reviews,
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
    });
  } catch (error: unknown) {
    console.error('Get host reviews error:', error);
    sendError(res, 500, 'Failed to get reviews');
  }
};

// Get reviews for an event
export const getEventReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const reviews = await Review.find({ eventId })
      .populate('userId', 'name email profileImage')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    sendSuccess(res, 200, 'Reviews retrieved successfully', {
      reviews,
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
    });
  } catch (error: unknown) {
    console.error('Get event reviews error:', error);
    sendError(res, 500, 'Failed to get reviews');
  }
};

// Update review
export const updateReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      sendError(res, 404, 'Review not found');
      return;
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.user!.id) {
      sendError(res, 403, 'You can only update your own reviews');
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (rating) updateData.rating = rating;
    if (comment) updateData.comment = comment;

    const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('userId', 'name email profileImage')
      .populate('eventId', 'title');

    sendSuccess(res, 200, 'Review updated successfully', { review: updatedReview });
  } catch (error: unknown) {
    console.error('Update review error:', error);
    sendError(res, 500, 'Failed to update review');
  }
};

// Delete review
export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      sendError(res, 404, 'Review not found');
      return;
    }

    // Check if user owns the review or is admin
    if (review.userId.toString() !== req.user!.id && req.user?.role !== 'Admin') {
      sendError(res, 403, 'You can only delete your own reviews');
      return;
    }

    await Review.findByIdAndDelete(id);

    sendSuccess(res, 200, 'Review deleted successfully', null);
  } catch (error: unknown) {
    console.error('Delete review error:', error);
    sendError(res, 500, 'Failed to delete review');
  }
};
