import mongoose, { Schema, Model } from 'mongoose';
import { IPayment } from '../../types';

const paymentSchema = new Schema<IPayment>(
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
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    stripePaymentId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookups
paymentSchema.index({ userId: 1, eventId: 1 });
paymentSchema.index({ stripePaymentId: 1 });

const Payment: Model<IPayment> = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
