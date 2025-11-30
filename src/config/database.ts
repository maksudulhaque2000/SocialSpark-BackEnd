import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.DATABASE_URL || 'mongodb://localhost:27017/socialspark';
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB Connected Successfully');
    
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB Connection Error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB Disconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

export default connectDB;
