import mongoose from 'mongoose';
import Event from '../modules/events/event.model';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Migration script to set isApproved=true for all existing events
 * This ensures that events created before the approval system was implemented
 * remain visible to users without requiring admin approval.
 * 
 * Run this script once after deploying the approval system:
 * npm run migrate:events
 */

const migrateExistingEvents = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.DATABASE_URL || 'mongodb://localhost:27017/event-management';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Update all events that don't have isApproved field set
    const result = await Event.updateMany(
      { isApproved: { $exists: false } }, // Only update events without this field
      { 
        $set: { 
          isApproved: true,
          rejectionReason: ''
        } 
      }
    );

    console.log(`✅ Migration completed successfully!`);
    console.log(`📊 Updated ${result.modifiedCount} events`);
    console.log(`📋 Matched ${result.matchedCount} events`);

    // Optional: Show summary of events by approval status
    const approved = await Event.countDocuments({ isApproved: true });
    const pending = await Event.countDocuments({ isApproved: false });
    
    console.log('\n📈 Event Status Summary:');
    console.log(`   Approved: ${approved}`);
    console.log(`   Pending: ${pending}`);
    console.log(`   Total: ${approved + pending}`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrateExistingEvents();
