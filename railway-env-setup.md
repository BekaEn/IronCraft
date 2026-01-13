# Railway Environment Variables Setup

## Backend Service Variables

Go to Backend service → Variables tab → Add these:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=change-this-to-a-random-secure-string-min-32-chars

# Database (use Railway references - type exactly as shown)
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}

# TBC Bank (add your actual credentials)
TBC_CLIENT_ID=your_tbc_client_id
TBC_CLIENT_SECRET=your_tbc_client_secret
TBC_PAYMENT_URL=https://api.tbcbank.ge/v1

# URLs (use Railway references)
FRONTEND_URL=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}
BACKEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

## Frontend Service Variables

Go to Frontend service → Variables tab → Add these:

```
VITE_API_BASE_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}/api
```

## Generate Public Domains

For both Backend and Frontend services:
1. Go to service → Settings → Networking
2. Click "Generate Domain"
3. Railway will create a public URL

## Import Database Schema

After MySQL is running:

1. Click MySQL service → Connect tab
2. Copy the connection details
3. Run locally:
   ```bash
   mysql -h <host> -u <user> -p<password> -P <port> <database> < database/schema.sql
   ```

Or use Railway's built-in database client if available.

## Deployment Order

1. ✅ Create MySQL database
2. ✅ Deploy Backend (wait for it to be healthy)
3. ✅ Deploy Frontend
4. ✅ Import database schema
5. ✅ Test the application

## Verify Deployment

- Backend health check: `https://your-backend.railway.app/api/health`
- Frontend: `https://your-frontend.railway.app`

## Troubleshooting

If backend fails to start:
- Check logs in Railway dashboard
- Verify all environment variables are set
- Ensure database connection is working

If frontend can't connect to backend:
- Verify VITE_API_BASE_URL is correct
- Check CORS settings in backend
- Ensure backend is running and healthy
