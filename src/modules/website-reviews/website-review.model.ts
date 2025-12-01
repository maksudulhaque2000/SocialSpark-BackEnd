import mongoose, { Schema, Model } from 'mongoose';

export interface IWebsiteReview {
  _id: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const websiteReviewSchema = new Schema<IWebsiteReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
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
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
websiteReviewSchema.index({ status: 1, createdAt: -1 });
websiteReviewSchema.index({ userId: 1 });

const WebsiteReview: Model<IWebsiteReview> = mongoose.model<IWebsiteReview>(
  'WebsiteReview',
  websiteReviewSchema
);

export default WebsiteReview;
