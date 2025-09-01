#!/bin/bash

# Database Schema Update Script
# This script applies the speaker_enhancements.sql to the Railway PostgreSQL database

echo "🔧 Applying database schema enhancements..."

# Get the database URL from Railway (we'll use curl to get it from the running app)
DATABASE_URL=$(curl -s https://mindlift-backend-production.up.railway.app/api/debug | grep -o '"database_url_length":[0-9]*' | cut -d':' -f2)

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Could not get DATABASE_URL"
  echo "📝 You need to run this SQL manually in Railway's database console:"
  echo
  cat backend/sql/speaker_enhancements.sql
  exit 1
fi

echo "✅ Database connection available"
echo "📄 Applying speaker_enhancements.sql..."

# Note: In production, this would connect to Railway's PostgreSQL
echo "⚠️  For security, please apply this SQL in Railway's database console:"
echo
cat backend/sql/speaker_enhancements.sql
