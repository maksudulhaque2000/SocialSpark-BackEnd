# 🌟 SocialSpark Backend API

<div align="center">

![SocialSpark Logo](https://img.shields.io/badge/SocialSpark-Backend-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)

**A robust RESTful API for SocialSpark - A social event collaboration platform that connects people through events, activities, and shared experiences.**

[🌐 Live Demo](https://socialspark-backend-3ewo.onrender.com) • [📱 Frontend](https://socialspark-frontend.vercel.app) • [📖 Documentation](#-api-documentation)

</div>

---

## 🔗 Important Links

| Resource | Link |
|----------|------|
| 🌐 **Frontend Live** | [https://socialspark-frontend.vercel.app](https://socialspark-frontend.vercel.app) |
| 🔌 **Backend Live** | [https://socialspark-backend-3ewo.onrender.com](https://socialspark-backend-3ewo.onrender.com) |
| 📦 **Frontend Repository** | [GitHub - SocialSpark Frontend](https://github.com/maksudulhaque2000/SocialSpark-FrontEnd) |
| 🗂️ **Backend Repository** | [GitHub - SocialSpark Backend](https://github.com/maksudulhaque2000/SocialSpark-BackEnd) |

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [🔧 Environment Variables](#-environment-variables)
- [🗄️ Database Models](#️-database-models)
- [🚀 API Documentation](#-api-documentation)
- [📜 Available Scripts](#-available-scripts)
- [🏗️ Project Structure](#️-project-structure)
- [🔐 Authentication & Authorization](#-authentication--authorization)
- [💳 Payment Integration](#-payment-integration)
- [📊 Subscription System](#-subscription-system)
- [👨‍💼 Admin Panel Features](#-admin-panel-features)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with secure token generation
- Social login integration (Google & Facebook OAuth)
- Role-based access control (User, Host, Admin)
- bcrypt password hashing
- Protected route middleware

### 🎯 Event Management
- Complete CRUD operations for events
- Advanced search and filtering (category, location, date, price)
- Automatic event status management (upcoming, ongoing, completed, cancelled)
- Join/leave event functionality
- Participant tracking and management
- Admin approval system for new events
- 10+ event categories (Concerts, Sports, Hiking, Tech Meetups, Gaming, etc.)
- Revenue tracking for hosts

### 💳 Payment System
- Stripe payment integration
- Secure payment intent creation
- Real-time webhook handling for payment confirmation
- Complete payment history tracking
- Automatic revenue calculation for hosts
- Subscription-based discount application

### 📊 Subscription Management
- Three-tier subscription plans (Free, Pro, Premium)
- Auto-assignment of Free plan to new users
- Subscription-based event discounts (0%, 10%, 20%)
- Stripe-powered subscription payments
- Status tracking (active, expired, cancelled)

### ⭐ Review & Rating System
- Host and event reviews
- 5-star rating system
- Review reactions (like, love, helpful, insightful)
- Website feedback system with admin approval
- Edit and delete own reviews

### 💬 Communication Features
- Direct messaging between users
- Request-based conversation initiation
- Accept/reject message requests
- Read receipts and unread message counter
- Comprehensive conversation management

### 💭 Comments & Engagement
- Event commenting system
- Comment reactions (like, love, wow, sad, angry)
- Edit and delete comment functionality
- Real-time comment updates

### 👨‍💼 Admin Panel
- User management (view, activate/deactivate, delete, change roles)
- Event moderation (approve, reject, delete)
- Website review moderation
- Comprehensive dashboard statistics
- Bulk operations support

### 🖼️ File Management
- Cloudinary integration for image storage
- Profile and event banner image uploads
- Multer middleware for file handling
- Automatic image optimization

### 🔧 Additional Features
- Pagination support for efficient data loading
- Input validation using express-validator and Zod
- Comprehensive error handling
- CORS configuration
- TypeScript for type safety
- Database seeding utilities
- Migration scripts for data management

---

## 🛠️ Tech Stack

### Core Technologies
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | v18+ |
| **Express.js** | Web Framework | v5.1.0 |
| **TypeScript** | Programming Language | v5.9.3 |
| **MongoDB** | Database | v9.0.0 |
| **Mongoose** | ODM | v9.0.0 |

### Authentication & Security
| Technology | Purpose |
|------------|---------|
| **JWT** | Token-based Authentication |
| **bcryptjs** | Password Hashing |
| **express-validator** | Input Validation |
| **Zod** | Schema Validation |
| **CORS** | Cross-Origin Security |

### Payment & Subscription
| Technology | Purpose |
|------------|---------|
| **Stripe** | Payment Processing |
| **Stripe Webhooks** | Payment Events |

### File Management
| Technology | Purpose |
|------------|---------|
| **Cloudinary** | Image Storage & CDN |
| **Multer** | File Upload Middleware |

### Development Tools
| Technology | Purpose |
|------------|---------|
| **ts-node** | TypeScript Execution |
| **ts-node-dev** | Development Server |
| **dotenv** | Environment Variables |

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager
- Cloudinary account
- Stripe account

### Setup Instructions

**1. Clone Repository**
```bash
git clone https://github.com/maksudulhaque2000/SocialSpark-BackEnd.git
cd SocialSpark-BackEnd
```

**2. Install Dependencies**
```bash
npm install
```

**3. Configure Environment Variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/socialspark
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/socialspark

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

**4. Seed Database (Optional)**
```bash
# Seed demo users
npm run seed

# Seed subscription plans
npm run seed:subscriptions

# Assign free plans to existing users
npm run assign:free-plans
```

**5. Run Development Server**
```bash
npm run dev
```

The server will start at `http://localhost:5000`

**6. Build for Production**
```bash
npm run build
npm start
```

---

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/socialspark` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_xxxxx` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_xxxxx` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_xxxxx` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:3000` |

---

## 🗄️ Database Models

### User Model
```typescript
{
  name: string,
  email: string (unique),
  password: string (hashed),
  role: 'User' | 'Host' | 'Admin',
  profileImage: string,
  bio: string,
  interests: string[],
  isVerified: boolean,
  isActive: boolean,
  timestamps: { createdAt, updatedAt }
}
```

### Event Model
```typescript
{
  title: string,
  description: string,
  category: enum,
  location: string,
  date: Date,
  time: string,
  hostId: ObjectId (ref: User),
  bannerImage: string,
  maxParticipants: number,
  currentParticipants: number,
  price: number,
  isPaid: boolean,
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
  participants: ObjectId[],
  isApproved: boolean,
  rejectionReason: string,
  timestamps: { createdAt, updatedAt }
}
```

### Payment Model
```typescript
{
  userId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  amount: number,
  stripePaymentId: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  timestamps: { createdAt, updatedAt }
}
```

### Subscription Plan Model
```typescript
{
  name: string,
  slug: 'free' | 'pro' | 'premium',
  price: number,
  duration: number (days),
  discountPercentage: number,
  features: string[],
  isActive: boolean,
  timestamps: { createdAt, updatedAt }
}
```

### User Subscription Model
```typescript
{
  userId: ObjectId (ref: User),
  planId: ObjectId (ref: SubscriptionPlan),
  status: 'active' | 'expired' | 'cancelled',
  startDate: Date,
  endDate: Date,
  stripeSubscriptionId: string,
  timestamps: { createdAt, updatedAt }
}
```

### Review Model
```typescript
{
  userId: ObjectId (ref: User),
  hostId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  rating: number (1-5),
  comment: string,
  reactions: [{ userId, type: 'like' | 'love' | 'helpful' | 'insightful' }],
  timestamps: { createdAt, updatedAt }
}
```

### Conversation Model
```typescript
{
  participants: ObjectId[],
  status: 'pending' | 'accepted' | 'rejected',
  requestedBy: ObjectId (ref: User),
  requestedTo: ObjectId (ref: User),
  lastMessageAt: Date,
  timestamps: { createdAt, updatedAt }
}
```

### Message Model
```typescript
{
  conversationId: ObjectId (ref: Conversation),
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  content: string,
  isRead: boolean,
  timestamps: { createdAt, updatedAt }
}
```

### Comment Model
```typescript
{
  userId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  comment: string,
  reactions: [{ userId, type: 'like' | 'love' | 'wow' | 'sad' | 'angry' }],
  timestamps: { createdAt, updatedAt }
}
```

### Website Review Model
```typescript
{
  userId: ObjectId (ref: User),
  name: string,
  email: string,
  rating: number (1-5),
  comment: string,
  status: 'pending' | 'approved' | 'rejected',
  timestamps: { createdAt, updatedAt }
}
```

---

## 🚀 API Documentation

### Base URL
- **Local**: `http://localhost:5000/api`
- **Production**: `https://socialspark-backend-3ewo.onrender.com/api`

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "User"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Social Login
```http
POST /api/auth/social-login
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "profileImage": "https://example.com/image.jpg",
  "provider": "google"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### User Endpoints

#### Get User by ID
```http
GET /api/users/:id
```

#### Get Top Hosts
```http
GET /api/users/top-hosts
```

#### Get Host Profile with Stats
```http
GET /api/users/:id/profile
```

#### Update User Profile
```http
PATCH /api/users/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "Updated Name",
  "bio": "Updated bio",
  "interests": ["Sports", "Music"],
  "profileImage": <file>
}
```

#### Get User Events
```http
GET /api/users/:id/events
Authorization: Bearer <token>
```

#### Get User Hosted Events
```http
GET /api/users/:id/hosted-events
Authorization: Bearer <token>
```

### Event Endpoints

#### Get All Events
```http
GET /api/events?page=1&limit=10&category=Sports&search=football
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category
- `search`: Search in title and description
- `location`: Filter by location
- `isPaid`: Filter by paid/free events

#### Get Event Categories
```http
GET /api/events/categories
```

#### Get Event by ID
```http
GET /api/events/:id
```

#### Create Event (Host/Admin Only)
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Football Match",
  "description": "Exciting football match",
  "category": "Sports",
  "location": "Stadium",
  "date": "2024-12-31",
  "time": "18:00",
  "maxParticipants": 50,
  "price": 10,
  "isPaid": true,
  "bannerImage": <file>
}
```

#### Update Event
```http
PATCH /api/events/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Delete Event
```http
DELETE /api/events/:id
Authorization: Bearer <token>
```

#### Update Event Status
```http
PATCH /api/events/:id/status
Authorization: Bearer <token>

{
  "status": "cancelled"
}
```

#### Get Event Participants
```http
GET /api/events/:id/participants
Authorization: Bearer <token>
```

#### Get Event Revenue
```http
GET /api/events/:id/revenue
Authorization: Bearer <token>
```

#### Join Event
```http
POST /api/events/:id/join
Authorization: Bearer <token>
```

#### Leave Event
```http
POST /api/events/:id/leave
Authorization: Bearer <token>
```

### Payment Endpoints

#### Create Payment Intent
```http
POST /api/payments/create-intent
Authorization: Bearer <token>

{
  "eventId": "event_id_here"
}
```

#### Confirm Payment and Join Event
```http
POST /api/payments/confirm-and-join
Authorization: Bearer <token>

{
  "paymentIntentId": "pi_xxxxx",
  "eventId": "event_id_here"
}
```

#### Get User Payments
```http
GET /api/payments/user/:userId
Authorization: Bearer <token>
```

#### Get Host Revenue
```http
GET /api/payments/host/:hostId/revenue
Authorization: Bearer <token>
```

#### Stripe Webhook
```http
POST /api/payments/webhook
Content-Type: application/json
Stripe-Signature: <signature>
```

### Subscription Endpoints

#### Get Subscription Plans
```http
GET /api/subscriptions/plans
```

#### Get My Subscription
```http
GET /api/subscriptions/my-subscription
Authorization: Bearer <token>
```

#### Subscribe to Plan
```http
POST /api/subscriptions/subscribe
Authorization: Bearer <token>

{
  "planId": "plan_id_here"
}
```

#### Confirm Subscription Payment
```http
POST /api/subscriptions/confirm-subscription
Authorization: Bearer <token>

{
  "paymentIntentId": "pi_xxxxx",
  "planId": "plan_id_here"
}
```

#### Cancel Subscription
```http
POST /api/subscriptions/cancel
Authorization: Bearer <token>
```

#### Upsert Subscription Plan (Admin)
```http
POST /api/subscriptions/plans/upsert
Authorization: Bearer <token>

{
  "name": "Premium",
  "slug": "premium",
  "price": 29.99,
  "duration": 30,
  "discountPercentage": 20,
  "features": ["Feature 1", "Feature 2"]
}
```

#### Get All Subscriptions (Admin)
```http
GET /api/subscriptions/all
Authorization: Bearer <token>
```

### Review Endpoints

#### Get Host Reviews
```http
GET /api/reviews/host/:hostId
```

#### Get Event Reviews
```http
GET /api/reviews/event/:eventId
```

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>

{
  "hostId": "host_id_here",
  "eventId": "event_id_here",
  "rating": 5,
  "comment": "Great event!"
}
```

#### Update Review
```http
PATCH /api/reviews/:id
Authorization: Bearer <token>

{
  "rating": 4,
  "comment": "Updated comment"
}
```

#### Delete Review
```http
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

#### Add Review Reaction
```http
POST /api/reviews/:id/reaction
Authorization: Bearer <token>

{
  "type": "helpful"
}
```

#### Remove Review Reaction
```http
DELETE /api/reviews/:id/reaction
Authorization: Bearer <token>
```

### Comment Endpoints

#### Get Event Comments
```http
GET /api/comments/event/:eventId
```

#### Create Comment
```http
POST /api/comments
Authorization: Bearer <token>

{
  "eventId": "event_id_here",
  "comment": "Great event!"
}
```

#### Update Comment
```http
PATCH /api/comments/:id
Authorization: Bearer <token>

{
  "comment": "Updated comment"
}
```

#### Delete Comment
```http
DELETE /api/comments/:id
Authorization: Bearer <token>
```

#### Add Comment Reaction
```http
POST /api/comments/:id/reaction
Authorization: Bearer <token>

{
  "type": "like"
}
```

#### Remove Comment Reaction
```http
DELETE /api/comments/:id/reaction
Authorization: Bearer <token>
```

### Conversation Endpoints

#### Send Message Request
```http
POST /api/conversations/request
Authorization: Bearer <token>

{
  "receiverId": "user_id_here"
}
```

#### Get Message Requests
```http
GET /api/conversations/requests
Authorization: Bearer <token>
```

#### Check Conversation Exists
```http
GET /api/conversations/check/:userId
Authorization: Bearer <token>
```

#### Cancel Message Request
```http
DELETE /api/conversations/cancel/:receiverId
Authorization: Bearer <token>
```

#### Get All Conversations
```http
GET /api/conversations
Authorization: Bearer <token>
```

#### Get Conversation by ID
```http
GET /api/conversations/:id
Authorization: Bearer <token>
```

#### Accept Message Request
```http
PATCH /api/conversations/:id/accept
Authorization: Bearer <token>
```

#### Reject Message Request
```http
PATCH /api/conversations/:id/reject
Authorization: Bearer <token>
```

### Message Endpoints

#### Send Message
```http
POST /api/messages
Authorization: Bearer <token>

{
  "conversationId": "conversation_id_here",
  "receiverId": "user_id_here",
  "content": "Hello!"
}
```

#### Get Messages in Conversation
```http
GET /api/messages/:conversationId
Authorization: Bearer <token>
```

#### Mark Messages as Read
```http
PATCH /api/messages/:conversationId/read
Authorization: Bearer <token>
```

#### Get Unread Message Count
```http
GET /api/messages/unread/count
Authorization: Bearer <token>
```

### Website Review Endpoints

#### Get Approved Reviews
```http
GET /api/website-reviews/approved
```

#### Create Website Review
```http
POST /api/website-reviews
Authorization: Bearer <token>

{
  "name": "John Doe",
  "email": "john@example.com",
  "rating": 5,
  "comment": "Great platform!"
}
```

#### Get All Reviews (Admin)
```http
GET /api/website-reviews/all
Authorization: Bearer <token>
```

#### Get Pending Reviews (Admin)
```http
GET /api/website-reviews/pending
Authorization: Bearer <token>
```

#### Approve Review (Admin)
```http
PATCH /api/website-reviews/:id/approve
Authorization: Bearer <token>
```

#### Reject Review (Admin)
```http
PATCH /api/website-reviews/:id/reject
Authorization: Bearer <token>
```

#### Delete Review (Admin)
```http
DELETE /api/website-reviews/:id
Authorization: Bearer <token>
```

### Statistics Endpoints

#### Get Platform Statistics
```http
GET /api/stats
```

**Response includes:**
- Total users, hosts, events
- Events this month
- Active events
- Approved reviews count
- Category distribution

### Admin Endpoints

#### Get Dashboard Stats
```http
GET /api/admin/stats
Authorization: Bearer <token> (Admin only)
```

#### Get All Users
```http
GET /api/admin/users?page=1&limit=10&role=User&search=john
Authorization: Bearer <token> (Admin only)
```

#### Toggle User Status
```http
PATCH /api/admin/users/:id/toggle-status
Authorization: Bearer <token> (Admin only)
```

#### Update User Role
```http
PATCH /api/admin/users/:id/role
Authorization: Bearer <token> (Admin only)

{
  "role": "Host"
}
```

#### Delete User
```http
DELETE /api/admin/users/:id
Authorization: Bearer <token> (Admin only)
```

#### Get All Events (Admin)
```http
GET /api/admin/events?page=1&limit=10
Authorization: Bearer <token> (Admin only)
```

#### Get Pending Events
```http
GET /api/admin/events/pending
Authorization: Bearer <token> (Admin only)
```

#### Approve Event
```http
PATCH /api/admin/events/:id/approve
Authorization: Bearer <token> (Admin only)
```

#### Reject Event
```http
PATCH /api/admin/events/:id/reject
Authorization: Bearer <token> (Admin only)

{
  "rejectionReason": "Does not meet guidelines"
}
```

#### Force Delete Event
```http
DELETE /api/admin/events/:id
Authorization: Bearer <token> (Admin only)
```

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `npm run dev` | Start development server with hot reload |
| **Build** | `npm run build` | Compile TypeScript to JavaScript |
| **Start** | `npm start` | Start production server |
| **Seed Users** | `npm run seed` | Seed demo users to database |
| **Seed Subscriptions** | `npm run seed:subscriptions` | Create subscription plans |
| **Assign Free Plans** | `npm run assign:free-plans` | Assign free plans to existing users |
| **Migrate Events** | `npm run migrate:events` | Run event migration script |
| **Migrate Reviews** | `npm run migrate:reviews` | Run review migration script |

---

## 🏗️ Project Structure

```
SocialSpark-BackEnd/
├── src/
│   ├── app.ts                      # Application entry point
│   ├── config/                     # Configuration files
│   │   ├── cloudinary.ts          # Cloudinary setup
│   │   ├── database.ts            # MongoDB connection
│   │   └── stripe.ts              # Stripe configuration
│   ├── middlewares/               # Express middlewares
│   │   ├── auth.middleware.ts     # Authentication & authorization
│   │   ├── error.middleware.ts    # Error handling
│   │   ├── upload.middleware.ts   # File upload
│   │   └── validation.middleware.ts # Input validation
│   ├── modules/                   # Feature modules
│   │   ├── admin/                 # Admin management
│   │   │   ├── admin.controller.ts
│   │   │   └── admin.routes.ts
│   │   ├── auth/                  # Authentication
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validation.ts
│   │   ├── comments/              # Comment system
│   │   │   ├── comment.controller.ts
│   │   │   ├── comment.model.ts
│   │   │   └── comment.routes.ts
│   │   ├── conversations/         # Conversation management
│   │   │   ├── conversation.controller.ts
│   │   │   ├── conversation.model.ts
│   │   │   └── conversation.routes.ts
│   │   ├── events/                # Event management
│   │   │   ├── event.controller.ts
│   │   │   ├── event.model.ts
│   │   │   ├── event.routes.ts
│   │   │   └── event.validation.ts
│   │   ├── messages/              # Messaging system
│   │   │   ├── message.controller.ts
│   │   │   ├── message.model.ts
│   │   │   └── message.routes.ts
│   │   ├── payments/              # Payment processing
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.model.ts
│   │   │   ├── payment.routes.ts
│   │   │   └── payment.validation.ts
│   │   ├── reviews/               # Review system
│   │   │   ├── review.controller.ts
│   │   │   ├── review.model.ts
│   │   │   ├── review.routes.ts
│   │   │   └── review.validation.ts
│   │   ├── stats/                 # Statistics
│   │   │   ├── stats.controller.ts
│   │   │   └── stats.routes.ts
│   │   ├── subscriptions/         # Subscription management
│   │   │   ├── subscription.controller.ts
│   │   │   ├── subscription.model.ts
│   │   │   ├── subscription.routes.ts
│   │   │   └── subscription.validation.ts
│   │   ├── users/                 # User management
│   │   │   ├── user.controller.ts
│   │   │   ├── user.model.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.validation.ts
│   │   └── website-reviews/       # Website feedback
│   │       ├── website-review.controller.ts
│   │       ├── website-review.model.ts
│   │       ├── website-review.routes.ts
│   │       └── website-review.validation.ts
│   ├── types/                     # TypeScript types
│   │   └── index.ts
│   └── utils/                     # Utility functions
│       ├── assign-free-plans.ts   # Auto-assign free plans
│       ├── cloudinary.util.ts     # Cloudinary helpers
│       ├── event-status.util.ts   # Event status automation
│       ├── jwt.util.ts            # JWT helpers
│       ├── migrate-events.ts      # Event migration
│       ├── migrate-reviews.ts     # Review migration
│       ├── pagination.util.ts     # Pagination helpers
│       ├── response.util.ts       # Response formatting
│       ├── seed-subscriptions.ts  # Subscription seeding
│       └── seed.ts                # User seeding
├── .env                           # Environment variables
├── .gitignore                     # Git ignore file
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript configuration
├── render.yaml                    # Render deployment config
└── README.md                      # Project documentation
```

---

## 🔐 Authentication & Authorization

### Authentication Flow
1. User registers or logs in (email/password or social login)
2. Server generates JWT token with user data
3. Client stores token (localStorage or cookies)
4. Client includes token in Authorization header for protected routes
5. Server validates token and extracts user information

### Authorization Roles

| Role | Permissions |
|------|-------------|
| **User** | Join events, write reviews, send messages, comment on events, manage own profile |
| **Host** | All User permissions + Create/manage events, view event revenue and participants |
| **Admin** | All permissions + Manage users, approve/reject events, moderate content, view analytics |

### Protected Route Implementation
```typescript
// Authentication required
router.get('/api/events/:id/join', authenticate, joinEvent);

// Specific role required
router.post('/api/events', authenticate, authorize('Host', 'Admin'), createEvent);
```

---

## 💳 Payment Integration

### Stripe Configuration

1. **Create Stripe Account**
   - Sign up at [stripe.com](https://stripe.com)
   - Get API keys from Dashboard

2. **Configure Webhook**
   - Add webhook endpoint: `https://your-domain.com/api/payments/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Get webhook signing secret

3. **Update Environment Variables**
   ```env
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_secret
   ```

### Payment Flow

1. **Payment Intent Creation**
   - User selects a paid event
   - Backend creates Stripe payment intent
   - Checks for active subscription and applies discount
   - Returns client secret to frontend

2. **Payment Processing**
   - User enters payment details on frontend
   - Stripe processes payment securely
   - Payment intent status updates

3. **Webhook Confirmation**
   - Stripe sends webhook to backend
   - Backend verifies webhook signature
   - Updates payment status
   - Automatically adds user to event participants
   - Updates event participant count

### Subscription Discount Tiers
- **Free Plan**: 0% discount on events
- **Pro Plan**: 10% discount on events
- **Premium Plan**: 20% discount on events

---

## 📊 Subscription System

### Subscription Plans

| Plan | Price | Duration | Discount | Description |
|------|-------|----------|----------|-------------|
| **Free** | $0.00 | 30 days | 0% | Basic access to all events |
| **Pro** | $9.99 | 30 days | 10% | 10% discount on all paid events |
| **Premium** | $19.99 | 30 days | 20% | 20% discount on all paid events |

### Features

- **Auto-assignment**: New users automatically receive Free plan
- **Upgrade Anytime**: Users can upgrade to Pro or Premium anytime
- **Expiration Tracking**: Plans expire after duration, status updates to 'expired'
- **Stripe Integration**: Seamless payment processing for Pro and Premium plans
- **Discount Application**: Automatic discount calculation on event payments

### Subscription Workflow

1. User selects a subscription plan
2. Backend creates Stripe payment intent
3. User completes payment on frontend
4. Webhook confirms payment
5. User subscription record created/updated
6. Discounts automatically apply to future event payments

---

## 👨‍💼 Admin Panel Features

### User Management
- View all users with detailed statistics
- Filter users by role (User, Host, Admin)
- Search users by name or email
- Activate/deactivate user accounts
- Change user roles
- Delete users (with cascade delete of related data)
- View user's hosted and joined events count

### Event Moderation
- View all events (approved and pending)
- Filter pending events awaiting approval
- Approve events for public visibility
- Reject events with reason
- Force delete inappropriate events
- View event statistics and participant counts

### Content Moderation
- Review website feedback submissions
- Approve reviews for public display
- Reject inappropriate reviews
- Delete spam or offensive content
- View all reviews with filtering options

### Analytics Dashboard
- Total users, hosts, and events
- Events created this month
- Active events (upcoming and ongoing)
- Approved website reviews count
- Top event categories distribution
- Platform growth metrics

---

## 🤝 Contributing

We welcome contributions to SocialSpark! Please follow these guidelines:

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/maksudulhaque2000/SocialSpark-BackEnd.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit Your Changes**
   ```bash
   git commit -m 'Add: Brief description of your feature'
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Wait for code review

### Code Style Guidelines
- Use TypeScript for type safety
- Follow ESLint configuration
- Write descriptive variable names
- Add comments for complex logic
- Keep functions small and focused

---

## 📄 License

This project is licensed under the ISC License. You are free to use, modify, and distribute this software for personal and commercial purposes.

---

## 👨‍💻 Developer

**Maksudulhaque2000**

- GitHub: [@maksudulhaque2000](https://github.com/maksudulhaque2000)
- Frontend Repository: [SocialSpark-FrontEnd](https://github.com/maksudulhaque2000/SocialSpark-FrontEnd)
- Backend Repository: [SocialSpark-BackEnd](https://github.com/maksudulhaque2000/SocialSpark-BackEnd)

---

## 🙏 Acknowledgments

- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - Flexible NoSQL database
- **Stripe** - Secure payment processing platform
- **Cloudinary** - Powerful image management solution
- **TypeScript** - JavaScript with syntax for types
- **Mongoose** - Elegant MongoDB object modeling

---

<div align="center">

**⭐ If you find this project helpful, please give it a star! ⭐**

[🌐 Live Demo](https://socialspark-backend-3ewo.onrender.com) • [📱 Frontend](https://socialspark-frontend.vercel.app) • [📖 Documentation](#-api-documentation)

Made with ❤️ by [Maksudulhaque2000](https://github.com/maksudulhaque2000)

</div>
