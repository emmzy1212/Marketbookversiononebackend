import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// Route imports
import itemRoutes from './routes/itemRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------
// 🔐 Security Middleware
// -----------------------------
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// -----------------------------
// 🌐 CORS Configuration
// -----------------------------
const allowedOrigins = [
  'https://marketbookversionone.vercel.app', // Production
  'http://localhost:5173'                    // Dev (Vite)
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow curl/postman/mobile
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));

// -----------------------------
// 🛡️ Rate Limiting (for user-related routes)
// -----------------------------
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api/users', limiter);

// -----------------------------
// 🔧 Core Middleware
// -----------------------------
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// -----------------------------
// 🔄 Routes
// -----------------------------
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Root Route
app.get('/', (req, res) => {
  res.send('MarketBook API is running...');
});

// -----------------------------
// 🧯 Error Handling Middleware
// -----------------------------
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// -----------------------------
// 🚀 MongoDB Connection + Server Start
// -----------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  });
