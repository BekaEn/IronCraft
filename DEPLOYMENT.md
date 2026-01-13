# Full-Stack Deployment Guide

## Railway.app Deployment (RECOMMENDED)

Railway allows you to deploy frontend, backend, and MySQL database together from one GitHub repository.

### Step 1: Sign Up & Connect GitHub

1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Authorize Railway to access your repositories

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `IronCraft` repository
4. Railway will detect your monorepo structure

### Step 3: Add MySQL Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway will automatically create a MySQL instance
4. Copy the connection details (they'll be available as environment variables)

### Step 4: Deploy Backend Service

1. Click **"+ New"** → **"GitHub Repo"** → Select your repo
2. Configure the service:
   - **Name**: `backend`
   - **Root Directory**: `/backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   
   # Database (use Railway's MySQL variables)
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   
   # TBC Bank (add your credentials)
   TBC_CLIENT_ID=your_tbc_client_id
   TBC_CLIENT_SECRET=your_tbc_client_secret
   TBC_PAYMENT_URL=https://api.tbcbank.ge/v1
   
   # URLs (update after deployment)
   FRONTEND_URL=https://your-frontend.railway.app
   BACKEND_URL=https://your-backend.railway.app
   ```

### Step 5: Deploy Frontend Service

1. Click **"+ New"** → **"GitHub Repo"** → Select your repo again
2. Configure the service:
   - **Name**: `frontend`
   - **Root Directory**: `/frontend`
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `npx serve -s dist -l $PORT`
3. Add environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```

### Step 6: Import Database Schema

1. In Railway dashboard, click on your MySQL service
2. Click **"Connect"** tab
3. Use the provided connection string to connect via MySQL client:
   ```bash
   mysql -h <host> -u <user> -p<password> -P <port> <database> < database/schema.sql
   ```

### Step 7: Update URLs

1. Once deployed, Railway gives you URLs for frontend and backend
2. Update the environment variables with actual URLs:
   - In backend: `FRONTEND_URL`
   - In frontend: `VITE_API_BASE_URL`
3. Redeploy both services

### Pricing
- **Free Trial**: $5 credit (good for testing)
- **Hobby Plan**: $5/month + usage (~$10-20/month total for your app)

---

## Alternative: Render.com Deployment

Render offers a free tier and is also excellent for full-stack apps.

### Step 1: Sign Up

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create PostgreSQL Database (or MySQL)

1. Click **"New +"** → **"PostgreSQL"**
2. Choose **Free** tier
3. Name it `ironcraft-db`
4. Copy the connection details

### Step 3: Create Backend Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `ironcraft-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables (same as Railway)

### Step 4: Create Frontend Static Site

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `ironcraft-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variables

### Pricing
- **Free Tier**: Available (with limitations)
- **Paid**: $7/month per service

---

## Alternative: DigitalOcean App Platform

More expensive but very reliable and scalable.

### Setup
1. Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
2. Connect GitHub repo
3. Add MySQL database component
4. Add two components: backend (web service) and frontend (static site)
5. Configure build/start commands similar to Railway

### Pricing
- **Basic**: ~$12/month minimum
- **Professional**: ~$25/month+

---

## Recommended Choice

**For your project, I recommend Railway.app because:**
- ✅ Easiest setup for monorepos
- ✅ MySQL included (your project uses MySQL)
- ✅ Auto-deploys on git push
- ✅ Affordable pricing
- ✅ Great developer experience
- ✅ Built-in monitoring and logs

---

## Post-Deployment Checklist

- [ ] Database schema imported successfully
- [ ] Backend API responding at `/api/health` or similar
- [ ] Frontend loads and can connect to backend
- [ ] Environment variables set correctly
- [ ] CORS configured for frontend URL
- [ ] TBC Bank credentials added (for payment)
- [ ] Admin account accessible
- [ ] File uploads working (check storage configuration)

---

## Troubleshooting

### Backend won't start
- Check environment variables are set
- Verify database connection string
- Check logs in Railway/Render dashboard

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

### Database connection failed
- Verify MySQL service is running
- Check connection credentials
- Ensure schema is imported

---

## Support

If you need help:
1. Check Railway/Render documentation
2. Review deployment logs
3. Test locally first with production environment variables
