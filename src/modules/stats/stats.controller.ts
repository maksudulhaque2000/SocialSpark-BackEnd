import { Response } from 'express';
import { AuthRequest } from '../../types';
import User from '../users/user.model';
import Event from '../events/event.model';
import WebsiteReview from '../website-reviews/website-review.model';
import { sendSuccess, sendError } from '../../utils/response.util';

// Get platform statistics
export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalHosts = await User.countDocuments({ role: 'Host' });
    const totalEvents = await Event.countDocuments({ isApproved: true });
    const totalApprovedReviews = await WebsiteReview.countDocuments({ status: 'approved' });

    // Events this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const eventsThisMonth = await Event.countDocuments({
      isApproved: true,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Active events (upcoming and ongoing)
    const activeEvents = await Event.countDocuments({
      isApproved: true,
      status: { $in: ['upcoming', 'ongoing'] },
    });

    // Event categories distribution
    const categoryDistribution = await Event.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const stats = {
      totalUsers,
      totalHosts,
      totalEvents,
      eventsThisMonth,
      activeEvents,
      totalApprovedReviews,
      categoryDistribution,
    };

    sendSuccess(res, 200, 'Statistics retrieved successfully', stats);
  } catch (error: unknown) {
    console.error('Get stats error:', error);
    sendError(res, 500, 'Failed to get statistics');
  }
};
