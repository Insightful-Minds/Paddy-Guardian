#!/bin/bash

echo "🚀 Preparing Paddy Guardian for Deployment..."

# Check if we're in the right directory
if [ ! -f "backend/app.py" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🔧 Building frontend..."
npm run build

echo "✅ Frontend build complete!"

cd ../backend

echo "📦 Installing backend dependencies..."
pip install -r requirements.txt

echo "🧪 Testing backend..."
python -c "import flask, flask_cors, sklearn, joblib, tensorflow, numpy, PIL, transformers, peft; print('✅ All backend dependencies installed successfully')"

echo "📋 Deployment checklist:"
echo "✅ Frontend build completed"
echo "✅ Backend dependencies verified"
echo "📝 Next steps:"
echo "   1. Push code to GitHub"
echo "   2. Deploy backend to Railway.app"
echo "   3. Update VITE_API_URL in frontend/.env.production"
echo "   4. Deploy frontend to Vercel"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
