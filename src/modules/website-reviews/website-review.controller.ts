import { Response } from 'express';
import { AuthRequest } from '../../types';
import WebsiteReview from './website-review.model';
import User from '../users/user.model';
import { sendSuccess, sendError } from '../../utils/response.util';
import { getPaginationParams, getPaginationResult } from '../../utils/pagination.util';

// Create a new website review (authenticated users only)
export const createWebsiteReview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      sendError(res, 401, 'User not authenticated');
      return;
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    // Check if user already submitted a review
    const existingReview = await WebsiteReview.findOne({ userId });
    if (existingReview) {
      sendError(res, 400, 'You have already submitted a review');
      return;
    }

    // Create new review
    const review = await WebsiteReview.create({
      userId,
      name: user.name,
      email: user.email,
      rating,
      comment,
      status: 'pending',
    });

    sendSuccess(res, 201, 'Review submitted successfully. It will be published after admin approval.', {
      review,
    });
  } catch (error: unknown) {
    console.error('Create website review error:', error);
    sendError(res, 500, 'Failed to create review');
  }
};

// Get all approved reviews (public)
export const getApprovedReviews = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { page, limit } = req.query;

    const paginationParams = getPaginationParams({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    const reviews = await WebsiteReview.find({ status: 'approved' })
      .populate('userId', 'name profileImage')
      .sort(paginationParams.sort)
      .skip(paginationParams.skip)
      .limit(paginationParams.limit);

    const totalReviews = await WebsiteReview.countDocuments({ status: 'approved' });
    const pagination = getPaginationResult(
      paginationParams.page,
      paginationParams.limit,
      totalReviews
    );

    sendSuccess(res, 200, 'Approved reviews retrieved successfully', {
      reviews,
      pagination,
    });
  } catch (error: unknown) {
    console.error('Get approved reviews error:', error);
    sendError(res, 500, 'Failed to get reviews');
  }
};

// Get all reviews with filters (admin only)
export const getAllReviews = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { page, limit, status } = req.query;

    const filter: Record<string, unknown> = {};
    if (status) {
      filter.status = status;
    }

    const paginationParams = getPaginationParams({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    const reviews = await WebsiteReview.find(filter)
      .populate('userId', 'name email profileImage')
      .sort(paginationParams.sort)
      .skip(paginationParams.skip)
      .limit(paginationParams.limit);

    const totalReviews = await WebsiteReview.countDocuments(filter);
    const pagination = getPaginationResult(
      paginationParams.page,
      paginationParams.limit,
      totalReviews
    );

    sendSuccess(res, 200, 'Reviews retrieved successfully', {
      reviews,
      pagination,
    });
  } catch (error: unknown) {
    console.error('Get all reviews error:', error);
    sendError(res, 500, 'Failed to get reviews');
  }
};

// Get pending reviews (admin only)
export const getPendingReviews = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { page, limit } = req.query;

    const paginationParams = getPaginationParams({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sortBy: 'createdAt',
      sortOrder: 'asc',
    });

    const reviews = await WebsiteReview.find({ status: 'pending' })
      .populate('userId', 'name email profileImage')
      .sort(paginationParams.sort)
      .skip(paginationParams.skip)
      .limit(paginationParams.limit);

    const totalReviews = await WebsiteReview.countDocuments({ status: 'pending' });
    const pagination = getPaginationResult(
      paginationParams.page,
      paginationParams.limit,
      totalReviews
    );

    sendSuccess(res, 200, 'Pending reviews retrieved successfully', {
      reviews,
      pagination,
    });
  } catch (error: unknown) {
    console.error('Get pending reviews error:', error);
    sendError(res, 500, 'Failed to get pending reviews');
  }
};

// Approve a review (admin only)
export const approveReview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await WebsiteReview.findById(id);
    if (!review) {
      sendError(res, 404, 'Review not found');
      return;
    }

    review.status = 'approved';
    await review.save();

    const populatedReview = await WebsiteReview.findById(id).populate(
      'userId',
      'name email profileImage'
    );

    sendSuccess(res, 200, 'Review approved successfully', {
      review: populatedReview,
    });
  } catch (error: unknown) {
    console.error('Approve review error:', error);
    sendError(res, 500, 'Failed to approve review');
  }
};

// Reject a review (admin only)
export const rejectReview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await WebsiteReview.findById(id);
    if (!review) {
      sendError(res, 404, 'Review not found');
      return;
    }

    review.status = 'rejected';
    await review.save();

    sendSuccess(res, 200, 'Review rejected successfully', null);
  } catch (error: unknown) {
    console.error('Reject review error:', error);
    sendError(res, 500, 'Failed to reject review');
  }
};

// Delete a review (admin only)
export const deleteReview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await WebsiteReview.findById(id);
    if (!review) {
      sendError(res, 404, 'Review not found');
      return;
    }

    await WebsiteReview.findByIdAndDelete(id);

    sendSuccess(res, 200, 'Review deleted successfully', null);
  } catch (error: unknown) {
    console.error('Delete review error:', error);
    sendError(res, 500, 'Failed to delete review');
  }
};
