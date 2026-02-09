const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const passport = require('passport');
const { configurePassport } = require('./config/passport');
const { globalLimiter, authLimiter } = require('./middleware/rateLimiter');

dotenv.config();

// Initialize Express app
const app = express();

// ==================== ENHANCED ERROR LOGGING ====================
process.on('uncaughtException', (error) => {
  console.error('❌ UNCAUGHT EXCEPTION:', error);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

// ==================== MIDDLEWARE SETUP ====================

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Passport setup (Google OAuth) - optional in local dev
try {
  configurePassport();
} catch (error) {
  console.warn('⚠️ Google OAuth not configured. Skipping passport Google strategy initialization.');
  console.warn(`   ${error?.message || error}`);
}
app.use(passport.initialize());

// Request logging middleware
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n═══════════════════════════════════════════════════`);
  console.log(`📨 ${timestamp} - ${req.method} ${req.originalUrl}`);
  console.log(`🌍 Origin: ${req.headers.origin || 'No origin'}`);
  console.log(`🔑 Auth Header: ${req.headers.authorization || 'No auth header'}`);
  console.log(`🍪 Cookies:`, req.cookies);

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log(`📝 Request Body:`, JSON.stringify(req.body, null, 2));
  }

  next();
});

// ==================== RATE LIMITING ====================
app.use(globalLimiter);
app.use('/api/auth', authLimiter);

// ==================== ROUTES ====================
const authRoutes = require('./routes/authRoutes');
const oauthRoutes = require('./routes/oauthRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const savingGoalRoutes = require('./routes/savingGoalRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/api/auth', authRoutes);
app.use('/auth', oauthRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/savings-goals', savingGoalRoutes);
app.use('/api/transactions', transactionRoutes);

// ==================== UTILITY ROUTES ====================

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
  });
});

// API documentation route
app.get('/', (_req, res) => {
  res.json({
    message: 'WalletWise Backend API is running',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me (requires token)'
      },
      budget: {
        set: 'POST /api/budget (requires token)',
        get: 'GET /api/budget (requires token)',
        getCurrent: 'GET /api/budget/current (requires token)',
        copyPrevious: 'POST /api/budget/copy-previous (requires token)',
        summary: 'GET /api/budget/stats/summary (requires token)'
      },
      savings_goals: {
        create: 'POST /api/savings-goals (requires token)',
        list: 'GET /api/savings-goals (requires token)',
        addAmount: 'PATCH /api/savings-goals/:id/add (requires token)'
      },
      transactions: {
        add: 'POST /api/transactions (requires token)',
        list: 'GET /api/transactions (requires token)'
      },
      dashboard: {
        summary: 'GET /api/dashboard/summary (requires token)'
      },
      utility: {
        health: 'GET /api/health'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requestedUrl: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/walletwise';

const start = async () => {
  try {
    console.log(`🔗 Connecting to MongoDB: ${MONGODB_URI}`);

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}`);
      console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('📊 Waiting for requests...');
    });
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('\n💡 Troubleshooting Tips:');
    console.log('1. Check if MongoDB service is running');
    console.log('2. Start MongoDB: "mongod" in terminal or "net start MongoDB" in Admin PowerShell');
    console.log('3. Check .env file has: MONGODB_URI=mongodb://localhost:27017/walletwise');
    process.exit(1);
  }
};

start();
