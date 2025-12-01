import { Response } from 'express';
import { AuthRequest } from '../../types';
import User from '../users/user.model';
import { generateToken } from '../../utils/jwt.util';
import { sendSuccess, sendError } from '../../utils/response.util';
import { assignFreePlanToUser } from '../subscriptions/subscription.controller';

// Register new user
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 400, 'User with this email already exists');
      return;
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'User',
    });

    // Assign free plan to new user (async, don't wait)
    assignFreePlanToUser(user._id.toString()).catch((error) => {
      console.error('Error assigning free plan to new user:', error);
    });

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    sendSuccess(res, 201, 'User registered successfully', {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        interests: user.interests,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (error: unknown) {
    console.error('Register error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    sendError(res, 500, 'Failed to register user');
  }
};

// Login user
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendError(res, 401, 'Invalid email or password');
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      sendError(res, 403, 'Your account has been suspended');
      return;
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      sendError(res, 401, 'Invalid email or password');
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    sendSuccess(res, 200, 'Login successful', {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        interests: user.interests,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    sendError(res, 500, 'Failed to login');
  }
};

// Social login (Google/Facebook)
export const socialLogin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, profileImage, provider } = req.body;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with random password (won't be used for social login)
      const randomPassword = Math.random().toString(36).slice(-8) + 'Aa1!';
      user = await User.create({
        name,
        email,
        password: randomPassword,
        profileImage,
        isVerified: true,
      });
    } else {
      // Update profile image if provided
      if (profileImage && !user.profileImage) {
        user.profileImage = profileImage;
        await user.save();
      }
    }

    // Check if user is active
    if (!user.isActive) {
      sendError(res, 403, 'Your account has been suspended');
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    sendSuccess(res, 200, 'Social login successful', {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        interests: user.interests,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (error: unknown) {
    console.error('Social login error:', error);
    sendError(res, 500, 'Failed to process social login');
  }
};

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Unauthorized');
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    sendSuccess(res, 200, 'User retrieved successfully', {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        interests: user.interests,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: unknown) {
    console.error('Get current user error:', error);
    sendError(res, 500, 'Failed to get user');
  }
};
