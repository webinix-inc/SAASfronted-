# SaaS Admin Frontend - Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites
- Backend deployed on Render: `https://ecommerce-1wlp.onrender.com`
- Vercel account connected to your repository

---

## Step-by-Step Deployment

### 1️⃣ **Set Environment Variables in Vercel**

This is the **MOST IMPORTANT** step. Your app will fail without this!

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project: `ecommerce-saas-five`
3. Go to **Settings** → **Environment Variables**
4. Add the following variable:

```
Name: REACT_APP_API_URL
Value: https://ecommerce-1wlp.onrender.com
Environment: Production, Preview, Development (select all)
```

5. Click **Save**

### 2️⃣ **Redeploy Your Application**

After adding the environment variable:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click the **⋯** (three dots) menu
4. Select **Redeploy**
5. Make sure "Use existing Build Cache" is **UNCHECKED**
6. Click **Redeploy**

---

## 🔧 Configuration Files

### `vercel.json` (Already Created)
Configures Vercel to handle SPA routing properly.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Environment Variables Required
- `REACT_APP_API_URL` - Backend API URL (Render)

---

## 🧪 Testing Your Deployment

After deployment completes:

1. Visit: `https://ecommerce-saas-five.vercel.app`
2. You should see the login page (not "You need to enable JavaScript")
3. Open browser console (F12) - you should see: `✅ SaaS Admin API Configuration loaded`
4. Try logging in with super admin credentials

---

## 🐛 Troubleshooting

### Issue: "You need to enable JavaScript to run this app"
**Cause**: `REACT_APP_API_URL` environment variable not set in Vercel
**Solution**: Follow Step 1 above and redeploy

### Issue: API calls failing with CORS errors
**Cause**: Backend doesn't allow your Vercel domain
**Solution**: Add `https://ecommerce-saas-five.vercel.app` to CORS origins in backend

### Issue: Login not working
**Cause**: Check backend logs on Render
**Solution**: Ensure backend is running and accessible

### Issue: Blank page after deployment
**Cause**: Build errors or missing environment variables
**Solution**: 
1. Check Vercel deployment logs
2. Verify `REACT_APP_API_URL` is set
3. Clear build cache and redeploy

---

## 📝 Local Development

1. Create `.env.local` file:
```env
REACT_APP_API_URL=http://localhost:5000
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Access at: `http://localhost:3002`

---

## 🔐 Backend Configuration (Render)

Make sure your backend allows requests from Vercel:

**In `server.js` CORS configuration:**
```javascript
const allowedOrigins = [
  'http://localhost:3002',
  'https://ecommerce-saas-five.vercel.app'
];
```

---

## 📚 Additional Notes

- This is a **Create React App** (NOT Next.js)
- Environment variables MUST start with `REACT_APP_`
- Changes to env vars require a full redeploy (not just rebuild)
- The `proxy` in `package.json` only works in development

---

## ✅ Checklist

- [ ] Environment variable `REACT_APP_API_URL` set in Vercel
- [ ] Vercel domain added to backend CORS
- [ ] Redeployed with fresh build (no cache)
- [ ] Can access login page without errors
- [ ] Browser console shows API configuration loaded
- [ ] Can successfully log in

---

## 🆘 Still Having Issues?

1. Check Vercel deployment logs
2. Check browser console (F12) for errors
3. Check backend Render logs
4. Verify environment variables are set correctly
5. Try clearing Vercel build cache and redeploying

