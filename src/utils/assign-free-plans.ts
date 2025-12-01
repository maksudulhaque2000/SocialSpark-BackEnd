import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../modules/users/user.model';
import { SubscriptionPlan, UserSubscription } from '../modules/subscriptions/subscription.model';

dotenv.config();

const assignFreePlanToExistingUsers = async () => {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    // Find the free plan
    const freePlan = await SubscriptionPlan.findOne({ slug: 'free', isActive: true });
    if (!freePlan) {
      throw new Error('Free plan not found in database. Please run seed:subscriptions first.');
    }

    console.log(`Found free plan: ${freePlan.name}`);

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    let assignedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      // Check if user already has a subscription
      const existingSubscription = await UserSubscription.findOne({ userId: user._id });
      
      if (existingSubscription) {
        console.log(`User ${user.email} already has a subscription. Skipping.`);
        skippedCount++;
        continue;
      }

      // Create free subscription
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + freePlan.duration);

      await UserSubscription.create({
        userId: user._id,
        planId: freePlan._id,
        status: 'active',
        startDate,
        endDate,
      });

      console.log(`✅ Free plan assigned to: ${user.email}`);
      assignedCount++;
    }

    console.log('\n📊 Summary:');
    console.log(`   - Total users: ${users.length}`);
    console.log(`   - Free plans assigned: ${assignedCount}`);
    console.log(`   - Skipped (already have subscription): ${skippedCount}`);
    console.log('\n🎉 Migration completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error assigning free plans:', error);
    process.exit(1);
  }
};

assignFreePlanToExistingUsers();
