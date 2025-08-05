# Deployment Guide for Paddy Guardian

## Prerequisites
- Git repository (GitHub recommended)
- Node.js installed locally
- Python 3.11 installed locally

## Backend Deployment (Railway.app)

### Step 1: Prepare Repository
1. Push your code to GitHub
2. Make sure all files in `/backend` folder are committed

### Step 2: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Choose the `backend` folder as root directory
6. Railway will automatically detect it's a Python app

### Step 3: Configure Environment Variables
In Railway dashboard:
- No special environment variables needed for basic setup
- Railway will automatically set `PORT` variable

### Step 4: Get Backend URL
- After deployment, Railway will provide a URL like: `https://your-app-name.railway.app`
- Copy this URL for frontend configuration

## Frontend Deployment (Vercel)

### Step 1: Configure API URL
1. Create `.env.production` file in `/frontend` folder:
```
VITE_API_URL=https://your-backend-url.railway.app
```

### Step 2: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Select your repository
5. Set root directory to `frontend`
6. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: Your Railway backend URL

### Step 3: Configure Build Settings
Vercel should auto-detect Vite, but if needed:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Alternative: Heroku Deployment (Full Stack)

### Backend on Heroku
1. Install Heroku CLI
2. In backend folder:
```bash
heroku create your-app-name-backend
git subtree push --prefix=backend heroku main
```

### Frontend on Heroku
1. In frontend folder:
```bash
heroku create your-app-name-frontend
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-nodejs
git subtree push --prefix=frontend heroku main
```

## Local Testing Before Deployment

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run build
npm run preview
```

## Important Notes

1. **Model Files**: Ensure all model files in `/backend/model/` are included in your repository
2. **CORS**: Make sure CORS is properly configured for your frontend domain
3. **File Size**: Large model files might cause deployment issues. Consider using Git LFS
4. **Environment Variables**: Never commit API keys or sensitive data
5. **Build Time**: First deployment might take 10-15 minutes due to AI model dependencies

## Troubleshooting

### Backend Issues
- Check Railway logs for Python dependency errors
- Verify all model files are present
- Ensure requirements.txt has all dependencies

### Frontend Issues
- Verify API URL is correctly set
- Check browser console for CORS errors
- Ensure build completes without TypeScript errors

### General
- Test API endpoints individually
- Check network requests in browser dev tools
- Verify file paths are correct in production

## Cost Estimates

### Free Tier (Recommended for testing)
- **Railway**: Free tier with 500 hours/month
- **Vercel**: Free tier with generous limits

### Paid Tier (For production)
- **Railway**: ~$5-10/month
- **Vercel**: Free for personal projects

## Post-Deployment Steps

1. Test all features thoroughly
2. Monitor application performance
3. Set up domain name (optional)
4. Configure SSL certificates (automatic on Railway/Vercel)
5. Set up monitoring and logging
