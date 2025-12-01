import { Response } from 'express';
import { AuthRequest } from '../../types';
import stripe from '../../config/stripe';
import Payment from './payment.model';
import Event from '../events/event.model';
import { sendSuccess, sendError } from '../../utils/response.util';

// Create payment intent
export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      sendError(res, 404, 'Event not found');
      return;
    }

    if (!event.isPaid || event.price === 0) {
      sendError(res, 400, 'This event is free');
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

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(event.price * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        eventId: event._id.toString(),
        userId: req.user!.id,
        eventTitle: event.title,
      },
    });

    // Create payment record
    await Payment.create({
      userId: req.user!.id,
      eventId: event._id,
      amount: event.price,
      stripePaymentId: paymentIntent.id,
      status: 'pending',
    });

    sendSuccess(res, 200, 'Payment intent created', {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: unknown) {
    console.error('Create payment intent error:', error);
    sendError(res, 500, 'Failed to create payment intent');
  }
};

// Stripe webhook handler
export const handleWebhook = async (req: AuthRequest, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    sendError(res, 400, 'Missing stripe signature');
    return;
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const { eventId, userId } = paymentIntent.metadata;

      // Update payment status
      await Payment.findOneAndUpdate(
        { stripePaymentId: paymentIntent.id },
        { status: 'completed' }
      );

      // Add user to event participants
      const eventDoc = await Event.findById(eventId);
      if (eventDoc && !eventDoc.participants.includes(userId)) {
        eventDoc.participants.push(userId);
        eventDoc.currentParticipants += 1;
        await eventDoc.save();
      }

      console.log('✅ Payment succeeded:', paymentIntent.id);
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;

      // Update payment status
      await Payment.findOneAndUpdate(
        { stripePaymentId: paymentIntent.id },
        { status: 'failed' }
      );

      console.log('❌ Payment failed:', paymentIntent.id);
    }

    res.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    sendError(res, 400, 'Webhook error');
  }
};

// Confirm payment and join event (for local development without webhook)
export const confirmPaymentAndJoin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      sendError(res, 400, 'Payment intent ID is required');
      return;
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      sendError(res, 400, 'Payment not completed');
      return;
    }

    const { eventId, userId } = paymentIntent.metadata;

    // Update payment status
    await Payment.findOneAndUpdate(
      { stripePaymentId: paymentIntentId },
      { status: 'completed' }
    );

    // Add user to event participants
    const eventDoc = await Event.findById(eventId);
    if (!eventDoc) {
      sendError(res, 404, 'Event not found');
      return;
    }

    // Check if user already joined
    if (eventDoc.participants.includes(userId)) {
      sendSuccess(res, 200, 'Already joined', { event: eventDoc });
      return;
    }

    // Add to participants
    eventDoc.participants.push(userId);
    eventDoc.currentParticipants += 1;
    await eventDoc.save();

    console.log('✅ Payment confirmed and user joined event:', eventId);

    sendSuccess(res, 200, 'Successfully joined event', { event: eventDoc });
  } catch (error: unknown) {
    console.error('Confirm payment error:', error);
    sendError(res, 500, 'Failed to confirm payment');
  }
};

// Get user payments
export const getUserPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Check if user is requesting their own payments or is admin
    if (req.user?.id !== userId && req.user?.role !== 'Admin') {
      sendError(res, 403, 'You can only view your own payments');
      return;
    }

    const payments = await Payment.find({ userId })
      .populate('eventId', 'title date location bannerImage')
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, 'Payments retrieved successfully', { payments });
  } catch (error: unknown) {
    console.error('Get user payments error:', error);
    sendError(res, 500, 'Failed to get payments');
  }
};

// Get host revenue
export const getHostRevenue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { hostId } = req.params;

    // Check if user is requesting their own revenue or is admin
    if (req.user?.id !== hostId && req.user?.role !== 'Admin') {
      sendError(res, 403, 'You can only view your own revenue');
      return;
    }

    // Get all events by host
    const events = await Event.find({ hostId });
    const eventIds = events.map((event) => event._id);

    // Get all completed payments for these events
    const payments = await Payment.find({
      eventId: { $in: eventIds },
      status: 'completed',
    }).populate('eventId', 'title date');

    // Calculate total revenue
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Group by event
    const revenueByEvent = payments.reduce((acc: Record<string, unknown>, payment) => {
      const eventId = payment.eventId._id.toString();
      if (!acc[eventId]) {
        acc[eventId] = {
          event: payment.eventId,
          revenue: 0,
          paymentCount: 0,
        };
      }
      (acc[eventId] as any).revenue += payment.amount;
      (acc[eventId] as any).paymentCount += 1;
      return acc;
    }, {});

    sendSuccess(res, 200, 'Revenue retrieved successfully', {
      totalRevenue,
      totalPayments: payments.length,
      revenueByEvent: Object.values(revenueByEvent),
    });
  } catch (error: unknown) {
    console.error('Get host revenue error:', error);
    sendError(res, 500, 'Failed to get revenue');
  }
};
