import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WebsiteReview from '../modules/website-reviews/website-review.model';
import User from '../modules/users/user.model';

dotenv.config();

const migrateReviews = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log('✅ Connected to MongoDB');

    // Find all reviews without name or email
    const reviews = await WebsiteReview.find({
      $or: [
        { name: { $exists: false } },
        { email: { $exists: false } },
        { name: '' },
        { email: '' }
      ]
    });

    console.log(`Found ${reviews.length} reviews to update`);

    let updated = 0;
    for (const review of reviews) {
      const user = await User.findById(review.userId);
      if (user) {
        review.name = user.name;
        review.email = user.email;
        await review.save();
        updated++;
        console.log(`✅ Updated review ${review._id} with user data`);
      } else {
        console.log(`⚠️ User not found for review ${review._id}`);
      }
    }

    console.log(`\n✅ Migration completed. Updated ${updated} reviews.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateReviews();
