#!/bin/bash

# Railway Environment Variables Setup Script
# Run this after adding backend and frontend services in Railway dashboard

echo "Setting up Railway environment variables..."

# Backend environment variables
echo "Setting backend variables..."
railway variables --service backend set NODE_ENV=production
railway variables --service backend set PORT=5000
railway variables --service backend set JWT_SECRET="$(openssl rand -base64 32)"

# Database connection (Railway will auto-resolve these references)
railway variables --service backend set DB_HOST='${{MySQL.MYSQLHOST}}'
railway variables --service backend set DB_PORT='${{MySQL.MYSQLPORT}}'
railway variables --service backend set DB_USER='${{MySQL.MYSQLUSER}}'
railway variables --service backend set DB_PASSWORD='${{MySQL.MYSQLPASSWORD}}'
railway variables --service backend set DB_NAME='${{MySQL.MYSQLDATABASE}}'

# URLs (Railway will auto-resolve these references)
railway variables --service backend set FRONTEND_URL='https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}'
railway variables --service backend set BACKEND_URL='https://${{RAILWAY_PUBLIC_DOMAIN}}'

echo "Backend variables set!"

# Frontend environment variables
echo "Setting frontend variables..."
railway variables --service frontend set VITE_API_BASE_URL='https://${{backend.RAILWAY_PUBLIC_DOMAIN}}/api'

echo "Frontend variables set!"

echo ""
echo "✅ Environment variables configured!"
echo ""
echo "⚠️  Don't forget to add your TBC Bank credentials manually:"
echo "   railway variables --service backend set TBC_CLIENT_ID=your_client_id"
echo "   railway variables --service backend set TBC_CLIENT_SECRET=your_client_secret"
echo "   railway variables --service backend set TBC_PAYMENT_URL=https://api.tbcbank.ge/v1"
