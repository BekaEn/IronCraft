# Metal Wall Art E-commerce Platform

A complete e-commerce solution for selling handcrafted metal wall art and decorative pieces, integrated with TBC Bank payment system for the Georgian market.

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Sequelize
- **Database**: MySQL 8.0
- **Payment**: TBC Bank Payment Gateway
- **State Management**: Redux Toolkit + RTK Query
- **Authentication**: JWT + bcrypt

## 📁 Project Structure

```
smart-locks-ecommerce/
├── frontend/                    # React TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux store & slices
│   │   ├── services/          # API services (RTK Query)
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   └── hooks/             # Custom React hooks
│   └── package.json
├── backend/                     # Node.js Express backend
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── models/            # Sequelize database models
│   │   ├── routes/            # API route definitions
│   │   ├── middleware/        # Custom middleware
│   │   ├── config/            # Configuration files
│   │   └── utils/             # Utility functions
│   ├── uploads/               # Product image uploads
│   └── package.json
├── database/                    # Database scripts
│   └── schema.sql             # Database schema with sample data
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MySQL 8.0
- Git

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd smart-locks-ecommerce
```

### 2. Database Setup

1. Install MySQL 8.0
2. Create database and user:
   ```sql
   CREATE DATABASE smart_locks_ecommerce;
   CREATE USER 'smartlocks_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON smart_locks_ecommerce.* TO 'smartlocks_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. Import the schema (for new installation):
   ```bash
   mysql -u smartlocks_user -p smart_locks_ecommerce < database/schema.sql
   ```
   
   OR run the migration (if upgrading from smart locks to wall art):
   ```bash
   mysql -u smartlocks_user -p smart_locks_ecommerce < database/migrate_to_wallart.sql
   ```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your settings:
# - Database credentials
# - JWT secret (generate a secure random string)
# - TBC Bank API credentials (obtain from TBC Bank developer portal)

# Build the project
npm run build

# Start development server
npm run dev
```

The backend will start on http://localhost:5000

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on http://localhost:3000

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Environment
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=smartlocks_user
DB_PASSWORD=your_secure_password
DB_NAME=smart_locks_ecommerce

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# TBC Bank API (obtain from TBC Bank)
TBC_CLIENT_ID=your_tbc_client_id
TBC_CLIENT_SECRET=your_tbc_client_secret
TBC_PAYMENT_URL=https://api.tbcbank.ge/v1

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### Frontend Environment Variables

Create `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Smart Locks Georgia
```

## 📋 Features

### ✅ Completed Features

- **Frontend**:
  - Modern React 18 + TypeScript setup
  - Responsive design with Tailwind CSS
  - Redux Toolkit for state management
  - RTK Query for API calls
  - Home page with hero section and features
  - Product catalog with filtering
  - Detailed product pages
  - Shopping cart functionality
  - User authentication UI

- **Backend**:
  - Express.js with TypeScript
  - Sequelize ORM with MySQL
  - JWT authentication
  - Product CRUD operations
  - User registration/login
  - File upload for product images
  - Error handling middleware
  - CORS and security middleware

- **Database**:
  - Complete schema with relationships
  - Sample data for testing
  - Optimized indexes

### 🚧 In Progress

- TBC Bank payment integration
- Admin panel for product management
- Order management system

### 📝 Planned Features

- Email notifications
- Advanced search and filtering
- Product reviews and ratings
- Inventory tracking
- Analytics dashboard
- Mobile app (React Native)

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL injection prevention (Sequelize ORM)
- XSS protection with helmet.js
- CORS configuration
- Input validation
- File upload security

## 📦 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - List products (with filtering)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📊 Default Admin Account

- **Email**: admin@smartlocks.ge
- **Password**: admin123

⚠️ **Change this password immediately in production!**

## 🚀 Deployment

### Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
npm start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📞 TBC Bank Integration

To integrate with TBC Bank:

1. Register at [TBC Bank Developer Portal](https://developers.tbcbank.ge)
2. Obtain your Client ID and Client Secret
3. Configure webhook URLs for payment callbacks
4. Test in sandbox environment
5. Update `.env` with production credentials

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@smartlocks.ge
- Phone: +995 XXX XXX XXX

## 🙏 Acknowledgments

- TBC Bank for payment gateway integration
- React and Node.js communities
- All contributors and testers

---

Built with ❤️ for the Georgian market
