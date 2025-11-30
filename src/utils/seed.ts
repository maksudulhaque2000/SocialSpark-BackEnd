import dotenv from 'dotenv';
import User from '../modules/users/user.model';
import connectDB from '../config/database';

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    // Check if users already exist
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('✅ Demo users already exist');
      process.exit(0);
    }

    // Create demo users
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'Password@123',
        role: 'Admin',
        isVerified: true,
        isActive: true,
        bio: 'System Administrator',
      },
      {
        name: 'Host User',
        email: 'host@gmail.com',
        password: 'Password@123',
        role: 'Host',
        isVerified: true,
        isActive: true,
        bio: 'Professional Event Host',
        interests: ['Concerts', 'Tech Meetups', 'Networking'],
      },
      {
        name: 'Regular User',
        email: 'user@gmail.com',
        password: 'Password@123',
        role: 'User',
        isVerified: true,
        isActive: true,
        bio: 'Event Enthusiast',
        interests: ['Sports', 'Gaming', 'Food & Dining'],
      },
    ];

    await User.insertMany(demoUsers);

    console.log('✅ Demo users created successfully');
    console.log('\n📧 Demo Credentials:');
    console.log('Admin: admin@gmail.com / Password@123');
    console.log('Host: host@gmail.com / Password@123');
    console.log('User: user@gmail.com / Password@123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedUsers();
