import mongoose, { Schema, Model } from 'mongoose';
import { IReview } from '../../types';

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
      trim: true,
    },
    reactions: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        type: {
          type: String,
          enum: ['like', 'love', 'helpful', 'insightful'],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure one review per user per event
reviewSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
