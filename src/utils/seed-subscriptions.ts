import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { SubscriptionPlan } from '../modules/subscriptions/subscription.model';

dotenv.config();

const seedSubscriptionPlans = async () => {
  try {
    const MONGODB_URI = process.env.DATABASE_URL;
    if (!MONGODB_URI) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing plans
    await SubscriptionPlan.deleteMany({});
    console.log('🗑️  Cleared existing subscription plans');

    // Create subscription plans
    const plans = [
      {
        name: 'Free',
        slug: 'free',
        price: 0,
        duration: 365, // 1 year
        discountPercentage: 0,
        features: [
          'Access to all free events',
          'Join unlimited events',
          'Basic event notifications',
          'Community access',
        ],
        isActive: true,
      },
      {
        name: 'Pro',
        slug: 'pro',
        price: 9.99,
        duration: 30, // 1 month
        discountPercentage: 15,
        features: [
          'Everything in Free',
          '15% discount on all events',
          'Priority event registration',
          'Early access to new events',
          'Email support',
          'Exclusive Pro badges',
        ],
        isActive: true,
      },
      {
        name: 'Premium',
        slug: 'premium',
        price: 99.99,
        duration: 365, // 1 year
        discountPercentage: 40,
        features: [
          'Everything in Pro',
          '40% discount on all events',
          'VIP event access',
          'Exclusive Premium gifts',
          'Meet & greet opportunities',
          'Priority support (24/7)',
          'Custom event requests',
          'Premium member badge',
          'Exclusive community channel',
        ],
        isActive: true,
      },
    ];

    const createdPlans = await SubscriptionPlan.insertMany(plans);
    console.log(`✅ Created ${createdPlans.length} subscription plans:`);
    createdPlans.forEach((plan: { name: string; price: number; discountPercentage: number }) => {
      console.log(`   - ${plan.name}: $${plan.price} (${plan.discountPercentage}% discount)`);
    });

    console.log('\n🎉 Subscription plans seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding subscription plans:', error);
    process.exit(1);
  }
};

seedSubscriptionPlans();
