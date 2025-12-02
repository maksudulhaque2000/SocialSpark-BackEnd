import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'User' | 'Host' | 'Admin';
  };
  file?: Express.Multer.File;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'User' | 'Host' | 'Admin';
  profileImage?: string;
  bio?: string;
  interests?: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: Date;
  time: string;
  hostId: string;
  bannerImage?: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  isPaid: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants: string[];
  isApproved: boolean;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  _id: string;
  userId: string;
  hostId: string;
  eventId: string;
  rating: number;
  comment: string;
  reactions?: {
    userId: string;
    type: 'like' | 'love' | 'helpful' | 'insightful';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayment {
  _id: string;
  userId: string;
  eventId: string;
  amount: number;
  stripePaymentId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface IWebsiteReview {
  _id: string;
  userId: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'User' | 'Host' | 'Admin';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
