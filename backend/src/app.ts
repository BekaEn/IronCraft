import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import { sequelize } from './config/database';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import contactRoutes from './routes/contactRoutes';
import customOrderRoutes from './routes/customOrders';
import { errorHandler } from './middleware/errorHandler';
import settingRoutes from './routes/settingRoutes';
import heroSlideRoutes from './routes/heroSlideRoutes';

// Import models to ensure they are loaded
import './models/Product';
import './models/User';
import './models/Order';
import './models/Contact';
import './models/CustomOrder';
import './models/Setting';
import './models/HeroSlide';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000'
    ].filter(Boolean);
    
    // Allow requests with no origin (mobile apps, Postman, etc.) or from allowed origins
    if (!origin || allowedOrigins.some(allowed => origin.includes(allowed as string))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploaded images
// Serve from Railway Volume if available, otherwise from local uploads folder
const uploadsPath = process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));
// Also serve from local uploads as fallback
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/hero-slides', heroSlideRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/custom-orders', customOrderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection and server startup
const PORT = Number(process.env.PORT) || 5001;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Only sync in development, not in production
    // In production, use migrations to manage schema changes
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized.');
    } else {
      console.log('ℹ️ Production mode: Skipping auto-sync.');
      
      // Direct database fix for paymentMethod ENUM -> VARCHAR
      try {
        console.log('🔄 Checking orders table schema...');
        const [tables]: any = await sequelize.query("SHOW TABLES LIKE 'orders'");
        
        if (tables.length > 0) {
          // Check if paymentMethod is ENUM and change to VARCHAR
          const [columns]: any = await sequelize.query("SHOW COLUMNS FROM orders WHERE Field = 'paymentMethod'");
          if (columns.length > 0 && columns[0].Type.includes('enum')) {
            console.log('🔧 Converting paymentMethod from ENUM to VARCHAR...');
            await sequelize.query("ALTER TABLE `orders` MODIFY COLUMN `paymentMethod` VARCHAR(50) NOT NULL DEFAULT 'cash'");
            console.log('✅ paymentMethod column updated to VARCHAR(50)');
          } else {
            console.log('✅ paymentMethod column already VARCHAR or table structure OK');
          }
        } else {
          console.log('ℹ️ Orders table does not exist yet - will be created by model sync');
        }
      } catch (dbFixError: any) {
        console.error('⚠️ Database fix error (continuing):', dbFixError.message);
      }
    }

    // Start server on all interfaces for network access
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

startServer();

export default app;
