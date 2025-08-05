@echo off
echo 🚀 Preparing Paddy Guardian for Deployment...

if not exist "backend\app.py" (
    echo ❌ Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ❌ Please run this script from the project root directory
    pause
    exit /b 1
)

echo 📦 Installing frontend dependencies...
cd frontend
call npm install

echo 🔧 Building frontend...
call npm run build

echo ✅ Frontend build complete!

cd ..\backend

echo 📦 Installing backend dependencies...
pip install -r requirements.txt

echo 🧪 Testing backend...
python -c "import flask, flask_cors, sklearn, joblib, tensorflow, numpy, PIL, transformers, peft; print('✅ All backend dependencies installed successfully')"

echo.
echo 📋 Deployment checklist:
echo ✅ Frontend build completed
echo ✅ Backend dependencies verified
echo 📝 Next steps:
echo    1. Push code to GitHub
echo    2. Deploy backend to Railway.app
echo    3. Update VITE_API_URL in frontend/.env.production
echo    4. Deploy frontend to Vercel
echo.
echo 📖 See DEPLOYMENT.md for detailed instructions
pause
