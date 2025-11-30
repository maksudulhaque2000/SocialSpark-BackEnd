# 🚀 SocialSpark Backend API

A robust RESTful API for SocialSpark - A social event collaboration platform that connects people for events, activities, and experiences.

## 📋 Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Social login support (Google, Facebook)
- ✅ Role-based access control (User, Host, Admin)
- ✅ Secure password hashing with bcrypt

### Event Management
- ✅ Create, read, update, delete events
- ✅ Advanced search with filters (category, location, date)
- ✅ Event status management (Active, Cancelled, Completed)
- ✅ Join/leave events functionality
- ✅ Participant management

### Payment System
- ✅ Stripe payment integration
- ✅ Secure payment intent creation
- ✅ Webhook handling for payment confirmation
- ✅ Payment history tracking
- ✅ Host revenue calculation

### Review & Rating
- ✅ User reviews for hosts
- ✅ Event reviews
- ✅ 5-star rating system
- ✅ Review management (create, update, delete)

### Additional Features
- ✅ Image upload with Cloudinary
- ✅ Pagination support
- ✅ Input validation
- ✅ Comprehensive error handling
- ✅ CORS configuration

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, bcryptjs
- **Payment**: Stripe
- **File Upload**: Cloudinary, Multer
- **Validation**: express-validator

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Seed demo users
npm run seed

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/socialspark

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Frontend
FRONTEND_URL=http://localhost:3000

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts
│   │   ├── cloudinary.ts
│   │   └── stripe.ts
│   ├── middlewares/     # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── upload.middleware.ts
│   │   └── validation.middleware.ts
│   ├── modules/         # Feature modules
│   │   ├── auth/
│   │   ├── users/
│   │   ├── events/
│   │   ├── payments/
│   │   └── reviews/
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── app.ts           # Main application file
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

## 🔑 Demo Credentials

```
Admin:
Email: admin@gmail.com
Password: Password@123

Host:
Email: host@gmail.com
Password: Password@123

User:
Email: user@gmail.com
Password: Password@123
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/social-login` - Social login (Google/Facebook)
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile (Protected)
- `GET /api/users/:id/events` - Get user's joined events
- `GET /api/users/:id/hosted-events` - Get user's hosted events
- `GET /api/users/top-hosts` - Get top hosts

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Host only)
- `PUT /api/events/:id` - Update event (Host only)
- `DELETE /api/events/:id` - Delete event (Host only)
- `POST /api/events/:id/join` - Join event (Protected)
- `POST /api/events/:id/leave` - Leave event (Protected)
- `GET /api/events/categories` - Get event categories

### Payments
- `POST /api/payments/create-intent` - Create payment intent (Protected)
- `POST /api/payments/webhook` - Stripe webhook (Public)
- `GET /api/payments/my-payments` - Get user payments (Protected)
- `GET /api/payments/host-revenue` - Get host revenue (Host only)

### Reviews
- `POST /api/reviews` - Create review (Protected)
- `GET /api/reviews/host/:hostId` - Get host reviews
- `GET /api/reviews/event/:eventId` - Get event reviews
- `PUT /api/reviews/:id` - Update review (Protected)
- `DELETE /api/reviews/:id` - Delete review (Protected)

**Total**: 26 API endpoints

## 🚀 Deployment

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Cloudinary account
- Stripe account

### Build

```bash
npm run build
```

### Deploy to Render

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Create Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: socialspark-backend
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

3. **Add Environment Variables**
   - Go to "Environment" tab
   - Add all variables from `.env.example`
   - Important: Use production URLs and keys

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://your-app.onrender.com`

### Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add Environment Variables**
   ```bash
   railway variables set PORT=5000
   railway variables set DATABASE_URL=<your-mongodb-url>
   # Add all other variables
   ```

### Deploy to Vercel (Serverless)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json`**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/app.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/app.ts"
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   vercel
   ```

### MongoDB Setup

**Option 1: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (Free tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Update `DATABASE_URL` in environment variables

**Option 2: Local MongoDB**
```bash
# Install MongoDB
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod

# Use local connection string
DATABASE_URL=mongodb://localhost:27017/socialspark
```

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run seed     # Seed demo users
```

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **Authentication**: JWT tokens with expiration
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: express-validator for request validation
- **Error Handling**: Centralized error middleware
- **CORS**: Configurable origin whitelist
- **Environment Variables**: Sensitive data protection
- **SQL Injection**: MongoDB parameterized queries
- **XSS Protection**: Input sanitization

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
```bash
# Check if MongoDB is running
mongod --version

# Verify connection string in .env
DATABASE_URL=mongodb://localhost:27017/socialspark
```

**2. Port Already in Use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**3. TypeScript Errors**
```bash
# Clear build cache
rm -rf dist/
rm -rf node_modules/
npm install
npm run build
```

**4. Stripe Webhook Issues**
- Use Stripe CLI for local testing
- Verify webhook secret in .env
- Check webhook endpoint: `/api/payments/webhook`

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check API documentation
- Review error logs

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes.

## 🙏 Acknowledgments

- Express.js for the web framework
- MongoDB for the database
- Stripe for payment processing
- Cloudinary for image hosting

---

**Built with ❤️ for the SocialSpark community**
