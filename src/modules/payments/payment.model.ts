import mongoose, { Schema, Model } from 'mongoose';
import { IPayment } from '../../types';

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: true,
    } as any,
    eventId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Event',
      required: true,
    } as any,
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    stripePaymentId: {
      type: String,
      required: true,
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
paymentSchema.index({ stripePaymentId: 1 }, { unique: true });

const Payment: Model<IPayment> = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
