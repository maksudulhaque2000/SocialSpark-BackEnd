import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  status: 'pending' | 'accepted' | 'rejected';
  requestedBy: mongoose.Types.ObjectId;
  requestedTo: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastMessageAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ requestedBy: 1, requestedTo: 1 });
ConversationSchema.index({ status: 1 });

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
