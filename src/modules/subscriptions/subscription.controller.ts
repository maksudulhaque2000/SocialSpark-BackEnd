import { Response } from 'express';
import { AuthRequest } from '../../types';
import { SubscriptionPlan, UserSubscription } from './subscription.model';
import stripe from '../../config/stripe';
import { sendSuccess, sendError } from '../../utils/response.util';

// Helper function to assign free plan to new users
export const assignFreePlanToUser = async (userId: string): Promise<void> => {
  try {
    // Check if user already has any subscription
    const existingSubscription = await UserSubscription.findOne({ userId });
    if (existingSubscription) {
      return; // User already has a subscription
    }

    // Find the free plan
    const freePlan = await SubscriptionPlan.findOne({ slug: 'free', isActive: true });
    if (!freePlan) {
      console.error('Free plan not found in database');
      return;
    }

    // Create free subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + freePlan.duration);

    await UserSubscription.create({
      userId,
      planId: freePlan._id,
      status: 'active',
      startDate,
      endDate,
    });

    console.log(`Free plan assigned to user: ${userId}`);
  } catch (error) {
    console.error('Error assigning free plan:', error);
  }
};

// Get all subscription plans
export const getSubscriptionPlans = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });
    sendSuccess(res, 200, 'Subscription plans retrieved successfully', { plans });
  } catch (error: unknown) {
    console.error('Get subscription plans error:', error);
    sendError(res, 500, 'Failed to get subscription plans');
  }
};

// Get user's active subscription
export const getUserSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const subscription = await UserSubscription.findOne({
      userId,
      status: 'active',
      endDate: { $gte: new Date() },
    }).populate('planId');

    if (!subscription) {
      sendSuccess(res, 200, 'No active subscription', { subscription: null });
      return;
    }

    sendSuccess(res, 200, 'Subscription retrieved successfully', { subscription });
  } catch (error: unknown) {
    console.error('Get user subscription error:', error);
    sendError(res, 500, 'Failed to get subscription');
  }
};

// Subscribe to a plan
export const subscribeToPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { planId } = req.body;
    const userId = req.user!.id;

    console.log('Subscribe request:', { planId, userId });

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      console.log('Plan not found:', planId);
      sendError(res, 404, 'Subscription plan not found');
      return;
    }

    console.log('Plan found:', plan.name);

    // Check if user already has an active subscription
    const existingSubscription = await UserSubscription.findOne({
      userId,
      status: 'active',
      endDate: { $gte: new Date() },
    }).populate('planId');

    // If user has an active subscription, check if they're upgrading
    if (existingSubscription) {
      console.log('User has existing subscription:', existingSubscription);
      
      const existingPlanId = (existingSubscription.planId as any)._id 
        ? (existingSubscription.planId as any)._id.toString() 
        : existingSubscription.planId.toString();
      
      // If trying to subscribe to the same plan
      if (existingPlanId === planId) {
        sendError(res, 400, 'You are already subscribed to this plan');
        return;
      }
      
      // Allow upgrade/downgrade by cancelling the old subscription
      existingSubscription.status = 'cancelled';
      await existingSubscription.save();
      console.log('Previous subscription cancelled for upgrade');
    }

    // If free plan, create subscription directly
    if (plan.slug === 'free' || plan.price === 0) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);

      const subscription = await UserSubscription.create({
        userId,
        planId: plan._id,
        status: 'active',
        startDate,
        endDate,
      });

      sendSuccess(res, 201, 'Subscribed successfully', { subscription });
      return;
    }

    // For paid plans, create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(plan.price * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        planId: plan._id.toString(),
        userId: userId,
        planName: plan.name,
        type: 'subscription',
      },
    });

    sendSuccess(res, 200, 'Payment intent created', {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      plan,
    });
  } catch (error: unknown) {
    console.error('Subscribe to plan error:', error);
    sendError(res, 500, 'Failed to subscribe');
  }
};

// Confirm subscription payment
export const confirmSubscriptionPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user!.id;

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

    const { planId, type } = paymentIntent.metadata;

    if (type !== 'subscription') {
      sendError(res, 400, 'Invalid payment type');
      return;
    }

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      sendError(res, 404, 'Plan not found');
      return;
    }

    // Create subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = await UserSubscription.create({
      userId,
      planId: plan._id,
      status: 'active',
      startDate,
      endDate,
      stripeSubscriptionId: paymentIntentId,
    });

    const populatedSubscription = await UserSubscription.findById(subscription._id).populate('planId');

    sendSuccess(res, 201, 'Subscription activated successfully', {
      subscription: populatedSubscription,
    });
  } catch (error: unknown) {
    console.error('Confirm subscription payment error:', error);
    sendError(res, 500, 'Failed to confirm subscription');
  }
};

// Cancel subscription
export const cancelSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const subscription = await UserSubscription.findOne({
      userId,
      status: 'active',
    });

    if (!subscription) {
      sendError(res, 404, 'No active subscription found');
      return;
    }

    subscription.status = 'cancelled';
    await subscription.save();

    sendSuccess(res, 200, 'Subscription cancelled successfully', { subscription });
  } catch (error: unknown) {
    console.error('Cancel subscription error:', error);
    sendError(res, 500, 'Failed to cancel subscription');
  }
};

// Admin: Create/Update subscription plan
export const upsertSubscriptionPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'Admin') {
      sendError(res, 403, 'Only admins can manage subscription plans');
      return;
    }

    const { planId, name, slug, price, duration, discountPercentage, features, isActive } = req.body;

    if (planId) {
      // Update existing plan
      const plan = await SubscriptionPlan.findByIdAndUpdate(
        planId,
        { name, slug, price, duration, discountPercentage, features, isActive },
        { new: true, runValidators: true }
      );

      if (!plan) {
        sendError(res, 404, 'Plan not found');
        return;
      }

      sendSuccess(res, 200, 'Plan updated successfully', { plan });
    } else {
      // Create new plan
      const plan = await SubscriptionPlan.create({
        name,
        slug,
        price,
        duration,
        discountPercentage,
        features,
        isActive,
      });

      sendSuccess(res, 201, 'Plan created successfully', { plan });
    }
  } catch (error: unknown) {
    console.error('Upsert subscription plan error:', error);
    sendError(res, 500, 'Failed to save subscription plan');
  }
};

// Admin: Get all subscriptions
export const getAllSubscriptions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'Admin') {
      sendError(res, 403, 'Only admins can view all subscriptions');
      return;
    }

    const subscriptions = await UserSubscription.find()
      .populate('userId', 'name email')
      .populate('planId')
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, 'Subscriptions retrieved successfully', { subscriptions });
  } catch (error: unknown) {
    console.error('Get all subscriptions error:', error);
    sendError(res, 500, 'Failed to get subscriptions');
  }
};
