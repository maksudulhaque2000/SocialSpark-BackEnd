import mongoose, { Schema, Model } from 'mongoose';

export interface IComment {
  _id: string;
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  comment: string;
  reactions: {
    userId: mongoose.Types.ObjectId;
    type: 'like' | 'love' | 'wow' | 'sad' | 'angry';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      minlength: [1, 'Comment must be at least 1 character'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
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
          enum: ['like', 'love', 'wow', 'sad', 'angry'],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
commentSchema.index({ eventId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });

const Comment: Model<IComment> = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
