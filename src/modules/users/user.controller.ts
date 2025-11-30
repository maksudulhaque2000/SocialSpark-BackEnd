import { Response } from 'express';
import { AuthRequest } from '../../types';
import User from './user.model';
import Event from '../events/event.model';
import { sendSuccess, sendError } from '../../utils/response.util';
import { uploadToCloudinary } from '../../utils/cloudinary.util';

// Get user by ID
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    sendSuccess(res, 200, 'User retrieved successfully', { user });
  } catch (error: unknown) {
    console.error('Get user error:', error);
    sendError(res, 500, 'Failed to get user');
  }
};

// Update user profile
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if user is updating their own profile or is admin
    if (req.user?.id !== id && req.user?.role !== 'Admin') {
      sendError(res, 403, 'You can only update your own profile');
      return;
    }

    const { name, bio, interests } = req.body;
    const updateData: Record<string, unknown> = {};

    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (interests) updateData.interests = interests;

    // Handle profile image upload
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, 'socialspark/profiles');
      updateData.profileImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    sendSuccess(res, 200, 'Profile updated successfully', { user });
  } catch (error: unknown) {
    console.error('Update user error:', error);
    sendError(res, 500, 'Failed to update profile');
  }
};

// Get user's joined events
export const getUserEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const events = await Event.find({ participants: id })
      .populate('hostId', 'name email profileImage')
      .sort({ date: 1 });

    sendSuccess(res, 200, 'User events retrieved successfully', { events });
  } catch (error: unknown) {
    console.error('Get user events error:', error);
    sendError(res, 500, 'Failed to get user events');
  }
};

// Get user's hosted events
export const getUserHostedEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const events = await Event.find({ hostId: id })
      .populate('participants', 'name email profileImage')
      .sort({ date: -1 });

    sendSuccess(res, 200, 'Hosted events retrieved successfully', { events });
  } catch (error: unknown) {
    console.error('Get hosted events error:', error);
    sendError(res, 500, 'Failed to get hosted events');
  }
};

// Get top hosts (based on events count and ratings)
export const getTopHosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hosts = await User.find({ role: 'Host', isActive: true })
      .select('name email profileImage bio')
      .limit(10);

    // Get event counts for each host
    const hostsWithStats = await Promise.all(
      hosts.map(async (host) => {
        const eventCount = await Event.countDocuments({ hostId: host._id });
        return {
          ...host.toJSON(),
          eventCount,
        };
      })
    );

    // Sort by event count
    hostsWithStats.sort((a, b) => b.eventCount - a.eventCount);

    sendSuccess(res, 200, 'Top hosts retrieved successfully', { hosts: hostsWithStats });
  } catch (error: unknown) {
    console.error('Get top hosts error:', error);
    sendError(res, 500, 'Failed to get top hosts');
  }
};
