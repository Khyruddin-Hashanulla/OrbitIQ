# 📱 Mobile Data Loading Debug Guide

## Quick Mobile Debugging Steps

### 1. Test Backend API Directly on Mobile
Open these URLs in your mobile browser:

```
https://orbitiq-backend.onrender.com/api/health
https://orbitiq-backend.onrender.com/api/satellites
```

**Expected Results:**
- Health endpoint should show: `{"status": "OK", "message": "OrbitIQ API is running"}`
- Satellites endpoint should return array of satellite data

### 2. Check Mobile Browser Console
On mobile Chrome/Safari:
1. Open your deployed app: `https://orbitiq-frontend.onrender.com`
2. Enable desktop mode or use Chrome DevTools
3. Check Console tab for errors
4. Look for Network tab - check if API calls are failing

### 3. Verify Environment Variables
In Render dashboard, ensure frontend service has:
```bash
REACT_APP_API_URL=https://orbitiq-backend.onrender.com
```

### 4. Common Mobile Issues

**Issue: CORS Errors**
- Check browser console for CORS-related errors
- Verify backend CORS configuration includes frontend URL

**Issue: Network Timeouts**
- Mobile networks can be slower
- API calls may timeout before completing
- Check if backend is sleeping (Render free tier)

**Issue: Wrong API URL**
- Frontend might be calling wrong backend URL
- Check console logs for actual API calls being made

### 5. Test Steps

1. **Open mobile browser to your frontend**
2. **Check browser console** (enable desktop mode if needed)
3. **Look for these console messages:**
   ```
   API Base URL: https://orbitiq-backend.onrender.com
   Fetching satellites with params: {...}
   Making request to: https://orbitiq-backend.onrender.com/api/satellites
   ```

4. **If you see errors, note:**
   - Network errors (connection failed)
   - CORS errors (cross-origin blocked)
   - 404 errors (endpoint not found)
   - 500 errors (server error)

### 6. Wake Up Sleeping Services

Render free tier services sleep after 15 minutes. To wake them:
1. Visit backend health endpoint: `https://orbitiq-backend.onrender.com/api/health`
2. Wait 30-60 seconds for service to wake up
3. Then test your frontend again

### 7. Mobile-Specific Fixes Applied

- ✅ Fixed API URL configuration
- ✅ Added timeout handling for slow mobile networks
- ✅ Enhanced error messages for mobile debugging
- ✅ Added console logging for API calls

### 8. If Data Still Not Loading

**Check these in order:**

1. **Backend Health:** Visit health endpoint on mobile
2. **Environment Variables:** Verify `REACT_APP_API_URL` is set
3. **Console Errors:** Check mobile browser console
4. **Network Tab:** See if API calls are being made
5. **Service Status:** Check Render dashboard for service status

### 9. Expected Console Output

When working correctly, you should see:
```
API Base URL: https://orbitiq-backend.onrender.com
Fetching satellites with params: {page: 1, limit: 12}
Making request to: https://orbitiq-backend.onrender.com/api/satellites
API response: {satellites: [...], totalPages: 1, ...}
Satellites received: 18
```

### 10. Emergency Fallback

If nothing works, try:
1. Clear mobile browser cache
2. Try different mobile browser
3. Test on desktop first to isolate mobile-specific issues
4. Check Render service logs for backend errors
