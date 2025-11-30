import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { errorHandler, notFound } from './middlewares/error.middleware';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'SocialSpark API is running! 🚀',
    version: '1.0.0',
  });
});

// Import routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import eventRoutes from './modules/events/event.routes';
import paymentRoutes from './modules/payments/payment.routes';
import reviewRoutes from './modules/reviews/review.routes';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
