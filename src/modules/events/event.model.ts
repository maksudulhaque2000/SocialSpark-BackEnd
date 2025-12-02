import mongoose, { Schema, Model } from 'mongoose';
import { IEvent } from '../../types';

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
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
      ],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: 'Event date must be in the future',
      },
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    hostId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: true,
    } as any,
    bannerImage: {
      type: String,
      default: '',
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Maximum participants is required'],
      min: [1, 'At least 1 participant is required'],
      max: [1000, 'Maximum 1000 participants allowed'],
    },
    currentParticipants: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isApproved: {
      type: Boolean,
      default: true, // Default true for existing events
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for search optimization
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ category: 1, date: 1 });
eventSchema.index({ location: 1 });

const Event: Model<IEvent> = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
