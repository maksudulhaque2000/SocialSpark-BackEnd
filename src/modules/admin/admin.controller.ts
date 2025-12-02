import { Response } from 'express';
import { AuthRequest } from '../../types';
import User from '../users/user.model';
import Event from '../events/event.model';
import WebsiteReview from '../website-reviews/website-review.model';
import { sendSuccess, sendError } from '../../utils/response.util';
import { getPaginationParams, getPaginationResult } from '../../utils/pagination.util';

// ============= USER MANAGEMENT =============

// Get all users with filters
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, role, isActive, search } = req.query;

    const filter: Record<string, unknown> = {};

    if (role) {
      filter.role = role;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const paginationParams = getPaginationParams({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    const users = await User.find(filter)
      .select('-password')
      .sort(paginationParams.sort)
      .skip(paginationParams.skip)
      .limit(paginationParams.limit);

    const totalUsers = await User.countDocuments(filter);
    const pagination = getPaginationResult(
      paginationParams.page,
      paginationParams.limit,
      totalUsers
    );

    // Get user statistics
    const stats = await Promise.all(
      users.map(async (user) => {
        const hostedEvents = await Event.countDocuments({ hostId: user._id });
        const joinedEvents = await Event.countDocuments({ participants: user._id });
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          bio: user.bio,
          interests: user.interests,
          isVerified: user.isVerified,
          isActive: user.isActive,
          hostedEvents,
          joinedEvents,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      })
    );

    sendSuccess(res, 200, 'Users retrieved successfully', { users: stats, pagination });
  } catch (error: unknown) {
    console.error('Get all users error:', error);
    sendError(res, 500, 'Failed to get users');
  }
};

// Block/Unblock user
export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    // Prevent blocking admin themselves
    if (user._id.toString() === req.user?.id) {
      sendError(res, 400, 'You cannot block yourself');
      return;
    }

    // Toggle user active status
    user.isActive = !user.isActive;
    await user.save();

    const action = user.isActive ? 'unblocked' : 'blocked';
    sendSuccess(res, 200, `User ${action} successfully`, {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error: unknown) {
    console.error('Toggle user status error:', error);
    sendError(res, 500, 'Failed to update user status');
  }
};

// Delete user
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    // Prevent deleting admin themselves
    if (user._id.toString() === req.user?.id) {
      sendError(res, 400, 'You cannot delete yourself');
      return;
    }

    // If user is a host, check for active events
    if (user.role === 'Host') {
      const activeEvents = await Event.countDocuments({
        hostId: user._id,
        status: { $in: ['upcoming', 'ongoing'] },
      });

      if (activeEvents > 0) {
        sendError(
          res,
          400,
          'Cannot delete host with active events. Please cancel their events first.'
        );
        return;
      }
    }

    // Delete user's events if any
    await Event.deleteMany({ hostId: user._id });

    // Remove user from all event participants
    await Event.updateMany(
      { participants: user._id },
      { 
        $pull: { participants: user._id },
        $inc: { currentParticipants: -1 }
      }
    );

    // Delete user
    await User.findByIdAndDelete(id);

    sendSuccess(res, 200, 'User deleted successfully', null);
  } catch (error: unknown) {
    console.error('Delete user error:', error);
    sendError(res, 500, 'Failed to delete user');
  }
};

// Update user role
export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['User', 'Host', 'Admin'].includes(role)) {
      sendError(res, 400, 'Invalid role');
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    // Prevent changing own role
    if (user._id.toString() === req.user?.id) {
      sendError(res, 400, 'You cannot change your own role');
      return;
    }

    user.role = role;
    await user.save();

    sendSuccess(res, 200, 'User role updated successfully', {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    console.error('Update user role error:', error);
    sendError(res, 500, 'Failed to update user role');
  }
};

// ============= EVENT MANAGEMENT =============

// Get all events (including pending approval)
export const getAllEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, status, category, isApproved, hostId } = req.query;

    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (isApproved !== undefined) {
      filter.isApproved = isApproved === 'true';
    }

    if (hostId) {
      filter.hostId = hostId;
    }

    const paginationParams = getPaginationParams({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    const events = await Event.find(filter)
      .populate('hostId', 'name email profileImage')
      .sort(paginationParams.sort)
      .skip(paginationParams.skip)
      .limit(paginationParams.limit);

    const totalEvents = await Event.countDocuments(filter);
    const pagination = getPaginationResult(
      paginationParams.page,
      paginationParams.limit,
      totalEvents
    );

    sendSuccess(res, 200, 'Events retrieved successfully', { events, pagination });
  } catch (error: unknown) {
    console.error('Get all events error:', error);
    sendError(res, 500, 'Failed to get events');
  }
};

// Approve event
export const approveEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      sendError(res, 404, 'Event not found');
      return;
    }

    event.isApproved = true;
    await event.save();

    const populatedEvent = await Event.findById(id).populate('hostId', 'name email profileImage');

    sendSuccess(res, 200, 'Event approved successfully', { event: populatedEvent });
  } catch (error: unknown) {
    console.error('Approve event error:', error);
    sendError(res, 500, 'Failed to approve event');
  }
};

// Reject event
export const rejectEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      sendError(res, 404, 'Event not found');
      return;
    }

    event.status = 'cancelled';
    event.isApproved = false;
    event.rejectionReason = reason || 'Event rejected by admin';
    await event.save();

    sendSuccess(res, 200, 'Event rejected successfully', null);
  } catch (error: unknown) {
    console.error('Reject event error:', error);
    sendError(res, 500, 'Failed to reject event');
  }
};

// Force delete event
export const forceDeleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      sendError(res, 404, 'Event not found');
      return;
    }

    // Admin can delete any event regardless of participants
    await Event.findByIdAndDelete(id);

    sendSuccess(res, 200, 'Event deleted successfully', null);
  } catch (error: unknown) {
    console.error('Force delete event error:', error);
    sendError(res, 500, 'Failed to delete event');
  }
};

// ============= DASHBOARD STATISTICS =============

// Get admin dashboard statistics
export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalHosts = await User.countDocuments({ role: 'Host' });
    const totalEvents = await Event.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const blockedUsers = await User.countDocuments({ isActive: false });
    const pendingReviews = await WebsiteReview.countDocuments({ status: 'pending' });

    // Event statistics
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming', isApproved: true });
    const ongoingEvents = await Event.countDocuments({ status: 'ongoing' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });
    const pendingApproval = await Event.countDocuments({ isApproved: false, status: 'upcoming' });

    // Recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Recent events
    const newEventsThisMonth = await Event.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Category distribution
    const eventsByCategory = await Event.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Recent activity (last 10 users and events)
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentEvents = await Event.find()
      .populate('hostId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        blocked: blockedUsers,
        hosts: totalHosts,
        newThisMonth: newUsersThisMonth,
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
        ongoing: ongoingEvents,
        completed: completedEvents,
        pendingApproval,
        newThisMonth: newEventsThisMonth,
      },
      reviews: {
        pendingReviews,
      },
      categoryDistribution: eventsByCategory,
      recentUsers,
      recentEvents,
    };

    sendSuccess(res, 200, 'Dashboard statistics retrieved successfully', stats);
  } catch (error: unknown) {
    console.error('Get dashboard stats error:', error);
    sendError(res, 500, 'Failed to get dashboard statistics');
  }
};

// Get pending approval events
export const getPendingEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit } = req.query;

    const paginationParams = getPaginationParams({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sortBy: 'createdAt',
      sortOrder: 'asc',
    });

    const events = await Event.find({ isApproved: false, status: 'upcoming' })
      .populate('hostId', 'name email profileImage')
      .sort(paginationParams.sort)
      .skip(paginationParams.skip)
      .limit(paginationParams.limit);

    const totalEvents = await Event.countDocuments({ isApproved: false, status: 'upcoming' });
    const pagination = getPaginationResult(
      paginationParams.page,
      paginationParams.limit,
      totalEvents
    );

    sendSuccess(res, 200, 'Pending events retrieved successfully', { events, pagination });
  } catch (error: unknown) {
    console.error('Get pending events error:', error);
    sendError(res, 500, 'Failed to get pending events');
  }
};
