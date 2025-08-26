# 🚀 OrbitIQ Deployment Guide - Render + MongoDB Atlas

This guide will help you deploy OrbitIQ on Render with MongoDB Atlas as your database.

## 📋 Prerequisites

1. **GitHub Repository** - Your OrbitIQ code pushed to GitHub
2. **MongoDB Atlas Account** - Free tier available at [mongodb.com/atlas](https://www.mongodb.com/atlas)
3. **Render Account** - Free tier available at [render.com](https://render.com)
4. **API Keys** - From NASA, N2YO, and NewsAPI

## 🗄️ Step 1: Set Up MongoDB Atlas

### Create Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new project called "OrbitIQ"
3. Build a new cluster (choose M0 Sandbox for free tier)
4. Select your preferred cloud provider and region

### Configure Database Access
1. Go to **Database Access** → **Add New Database User**
2. Create a user with username/password authentication
3. Set privileges to "Read and write to any database"
4. Save the credentials securely

### Configure Network Access
1. Go to **Network Access** → **Add IP Address**
2. Add `0.0.0.0/0` to allow access from anywhere (for Render)
3. Or add Render's IP ranges for better security

### Get Connection String
1. Go to **Clusters** → **Connect** → **Connect your application**
2. Copy the connection string (MongoDB driver 4.1 or later)
3. Replace `<password>` with your database user password
4. Replace `<dbname>` with `orbitiq`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/orbitiq?retryWrites=true&w=majority`

## 🔑 Step 2: Get API Keys

### NASA API Key
- Visit: https://api.nasa.gov/
- Generate a free API key

### N2YO API Key (Satellite Tracking)
- Visit: https://www.n2yo.com/api/
- Sign up and get your API key

### NewsAPI Key
- Visit: https://newsapi.org/
- Register and get your API key

## 🌐 Step 3: Deploy Backend on Render

### Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `orbitiq-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm run build:production`
   - **Start Command**: `npm start`
   - **Plan**: `Starter` (free tier)

### Set Environment Variables
Add these environment variables in Render dashboard:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
NASA_API_KEY=your_nasa_api_key
N2YO_API_KEY=your_n2yo_api_key
NEWS_API_KEY=your_news_api_key
SPACEX_API_URL=https://api.spacexdata.com/v5
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Deploy
1. Click **Create Web Service**
2. Wait for deployment to complete
3. Note your backend URL: `https://orbitiq-backend.onrender.com`

## 🎨 Step 4: Deploy Frontend on Render

### Create Static Site
1. In Render Dashboard, click **New** → **Static Site**
2. Connect the same GitHub repository
3. Configure the static site:
   - **Name**: `orbitiq-frontend`
   - **Build Command**: `cd client && npm ci && npm run build`
   - **Publish Directory**: `client/build`

### Set Environment Variables
Add this environment variable:

```bash
REACT_APP_API_URL=https://orbitiq-backend.onrender.com
```

### Deploy
1. Click **Create Static Site**
2. Wait for deployment to complete
3. Your frontend will be available at: `https://orbitiq-frontend.onrender.com`

## 🔧 Step 5: Update CORS Configuration

After both services are deployed, update your backend environment variables:

```bash
CORS_ORIGIN=https://orbitiq-frontend.onrender.com
```

## ✅ Step 6: Verify Deployment

### Test Backend
Visit: `https://orbitiq-backend.onrender.com/api/health`

Expected response:
```json
{
  "status": "OK",
  "message": "OrbitIQ API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

### Test Frontend
1. Visit your frontend URL
2. Check if the app loads correctly
3. Test API connectivity by navigating through the app

## 🚨 Troubleshooting

### Common Issues

**Backend won't start:**
- Check environment variables are set correctly
- Verify MongoDB Atlas connection string
- Check build logs in Render dashboard

**Database connection fails:**
- Verify MongoDB Atlas network access settings
- Check username/password in connection string
- Ensure database user has proper permissions

**Frontend can't connect to backend:**
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS configuration on backend
- Ensure both services are deployed successfully

**API calls failing:**
- Verify all API keys are set correctly
- Check rate limiting settings
- Review server logs for specific errors

### Logs and Monitoring
- View logs in Render dashboard under **Logs** tab
- Monitor performance in **Metrics** tab
- Set up alerts for service health

## 💰 Cost Considerations

### Free Tier Limits
- **Render**: 750 hours/month for web services
- **MongoDB Atlas**: 512MB storage, shared cluster
- Services may sleep after 15 minutes of inactivity

### Upgrading
- Consider upgrading to paid plans for production use
- Paid plans offer better performance and no sleep mode

## 🔄 Continuous Deployment

Render automatically redeploys when you push to your connected GitHub branch:
1. Push changes to your main branch
2. Render detects changes and rebuilds
3. New version goes live automatically

## 📞 Support

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **OrbitIQ Issues**: Create issues in your GitHub repository

---

**🎉 Congratulations!** Your OrbitIQ application is now live on Render with MongoDB Atlas!
