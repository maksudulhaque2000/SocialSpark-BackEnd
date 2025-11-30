import { Response } from 'express';
import { AuthRequest } from '../../types';
import Event from './event.model';
import { sendSuccess, sendError } from '../../utils/response.util';
import { uploadToCloudinary } from '../../utils/cloudinary.util';
import { getPaginationParams, getPaginationResult } from '../../utils/pagination.util';

// Create event
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Only hosts and admins can create events
    if (req.user?.role !== 'Host' && req.user?.role !== 'Admin') {
      sendError(res, 403, 'Only hosts can create events');
      return;
    }

    const {
      title,
      description,
      category,
      location,
      date,
      time,
      maxParticipants,
      price,
      isPaid,
    } = req.body;

    let bannerImage = '';
    if (req.file) {
      bannerImage = await uploadToCloudinary(req.file.buffer, 'socialspark/events');
    }

    const event = await Event.create({
      title,
      description,
      category,
      location,
      date,
      time,
      hostId: req.user.id,
      bannerImage,
      maxParticipants,
      price: isPaid ? price : 0,
      isPaid: isPaid || false,
    });

    const populatedEvent = await Event.findById(event._id).populate(
      'hostId',
      'name email profileImage'
    );

    sendSuccess(res, 201, 'Event created successfully', { event: populatedEvent });
  } catch (error: unknown) {
    console.error('Create event error:', error);
    sendError(res, 500, 'Failed to create event');
  }
};

// Get all events with filters
export const getEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      category,
      location,
      dateFrom,
      dateTo,
      minPrice,
      maxPrice,
      status,
    } = req.query;

    // Build filter query
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$text = { $search: search as string };
    }

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom as string);
      if (dateTo) filter.date.$lte = new Date(dateTo as string);
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (status) {
      filter.status = status;
    } else {
      // By default, show only upcoming events
      filter.status = 'upcoming';
    }

    // Pagination
    const paginationParams = getPaginationParams({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
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
    console.error('Get events error:', error);
    sendError(res, 500, 'Failed to get events');
  }
};

// Get single event
export const getEventById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id)
      .populate('hostId', 'name email profileImage bio')
      .populate('participants', 'name email profileImage');

    if (!event) {
      sendError(res, 404, 'Event not found');
      return;
    }

    sendSuccess(res, 200, 'Event retrieved successfully', { event });
  } catch (error: unknown) {
    console.error('Get event error:', error);
    sendError(res, 500, 'Failed to get event');
  }
};

// Update event
export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      sendError(res, 404, 'Event not found');
      return;
    }

    // Check if user is the host or admin
    if (event.hostId.toString() !== req.user?.id && req.user?.role !== 'Admin') {
      sendError(res, 403, 'You can only update your own events');
      return;
    }

    const {
      title,
      description,
      category,
      location,
      date,
      time,
      maxParticipants,
      price,
      isPaid,
      status,
    } = req.body;

    const updateData: Record<string, unknown> = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (location) updateData.location = location;
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (maxParticipants) updateData.maxParticipants = maxParticipants;
    if (price !== undefined) updateData.price = price;
    if (isPaid !== undefined) updateData.isPaid = isPaid;
    if (status) updateData.status = status;

    // Handle banner image upload
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, 'socialspark/events');
      updateData.bannerImage = imageUrl;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('hostId', 'name email profileImage');

    sendSuccess(res, 200, 'Event updated successfully', { event: updatedEvent });
  } catch (error: unknown) {
    console.error('Update event error:', error);
    sendError(res, 500, 'Failed to update event');
  }
};

// Delete event
export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      sendError(res, 404, 'Event not found');
      return;
    }

    // Check if user is the host or admin
    if (event.hostId.toString() !== req.user?.id && req.user?.role !== 'Admin') {
      sendError(res, 403, 'You can only delete your own events');
      return;
    }

    // Check if event has participants
    if (event.currentParticipants > 0) {
      sendError(res, 400, 'Cannot delete event with participants. Please cancel it instead.');
      return;
    }

    await Event.findByIdAndDelete(id);

    sendSuccess(res, 200, 'Event deleted successfully', null);
  } catch (error: unknown) {
    console.error('Delete event error:', error);
    sendError(res, 500, 'Failed to delete event');
  }
};

// Join event
export const joinEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      sendError(res, 404, 'Event not found');
      return;
    }

    // Check if event is full
    if (event.currentParticipants >= event.maxParticipants) {
      sendError(res, 400, 'Event is full');
      return;
    }

    // Check if user already joined
    if (event.participants.includes(req.user!.id)) {
      sendError(res, 400, 'You have already joined this event');
      return;
    }

    // Check if event is upcoming
    if (event.status !== 'upcoming') {
      sendError(res, 400, 'Cannot join this event');
      return;
    }

    // Add user to participants
    event.participants.push(req.user!.id);
    event.currentParticipants += 1;
    await event.save();

    const updatedEvent = await Event.findById(id)
      .populate('hostId', 'name email profileImage')
      .populate('participants', 'name email profileImage');

    sendSuccess(res, 200, 'Successfully joined event', { event: updatedEvent });
  } catch (error: unknown) {
    console.error('Join event error:', error);
    sendError(res, 500, 'Failed to join event');
  }
};

// Leave event
export const leaveEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      sendError(res, 404, 'Event not found');
      return;
    }

    // Check if user is a participant
    const participantIndex = event.participants.indexOf(req.user!.id);
    if (participantIndex === -1) {
      sendError(res, 400, 'You are not a participant of this event');
      return;
    }

    // Remove user from participants
    event.participants.splice(participantIndex, 1);
    event.currentParticipants -= 1;
    await event.save();

    sendSuccess(res, 200, 'Successfully left event', null);
  } catch (error: unknown) {
    console.error('Leave event error:', error);
    sendError(res, 500, 'Failed to leave event');
  }
};

// Get event categories
export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = [
      'Concerts',
      'Sports',
      'Hiking',
      'Tech Meetups',
      'Gaming',
      'Food & Dining',
      'Arts & Culture',
      'Networking',
      'Workshops',
      'Other',
    ];

    sendSuccess(res, 200, 'Categories retrieved successfully', { categories });
  } catch (error: unknown) {
    console.error('Get categories error:', error);
    sendError(res, 500, 'Failed to get categories');
  }
};
