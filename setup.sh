#!/bin/bash

# MindLift Setup Script
# This script helps set up the MindLift application for development

echo "🚀 Setting up MindLift Application..."
echo "====================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your actual values."
    echo "   Required: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET"
else
    echo "✅ .env file already exists."
fi

# Install dependencies
echo "📦 Installing dependencies..."

echo "  - Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Root dependency installation failed"
    exit 1
fi

echo "  - Installing backend dependencies..."
cd backend && npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend dependency installation failed"
    exit 1
fi

echo "  - Installing frontend dependencies..."
cd ../frontend && npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependency installation failed"
    exit 1
fi

cd ..

echo "✅ Dependencies installed successfully!"

echo "
🎉 Setup complete!

Next steps:
1. Edit .env file with your database and service credentials
2. Set up PostgreSQL database:
   createdb mindlift
   psql -d mindlift -f backend/sql/schema.sql
3. Start the application:
   npm run dev

Visit http://localhost:3000 to view the application.
"
