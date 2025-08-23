# 🔧 ChainScope Environment Setup Guide

## 📋 Overview

ChainScope requires specific environment variables to function properly in production. This guide will help you set up the necessary configuration files.

## 🔑 Required Environment Variables

### 1. **Google Analytics** (Required for analytics)
- **Variable**: `VITE_GA_MEASUREMENT_ID`
- **Format**: `G-XXXXXXXXXX`
- **How to get**: 
  1. Go to [Google Analytics](https://analytics.google.com/)
  2. Create a new property for ChainScope
  3. Set up a web data stream
  4. Copy the Measurement ID

### 2. **Wallet Connect Project ID** (Required for wallet functionality)
- **Variable**: `VITE_REOWN_PROJECT_ID`
- **Format**: `project-id-string`
- **How to get**:
  1. Go to [Reown Cloud](https://cloud.reown.com/)
  2. Create a new project
  3. Copy the Project ID

## 📁 Environment File Creation

### Step 1: Create `.env.local` for Development

Create a file named `.env.local` in your project root with this content:

```env
# ChainScope Environment Configuration
# This file contains environment variables for local development

# =============================================================================
# 🔑 REQUIRED: GOOGLE ANALYTICS CONFIGURATION
# =============================================================================
# Get your Measurement ID from: https://analytics.google.com/
# Format: G-XXXXXXXXXX (replace with your actual ID)
VITE_GA_MEASUREMENT_ID=GA_MEASUREMENT_ID

# =============================================================================
# 🔑 REQUIRED: WALLET CONNECT PROJECT ID
# =============================================================================
# Get your Project ID from: https://cloud.reown.com/
# This is required for wallet functionality to work
VITE_REOWN_PROJECT_ID=demo-project-id

# =============================================================================
# 📱 APPLICATION CONFIGURATION
# =============================================================================
VITE_APP_NAME=ChainScope
VITE_APP_URL=http://localhost:8081
VITE_API_BASE_URL=https://api.chainscope.app

# =============================================================================
# ⚙️ FEATURE FLAGS
# =============================================================================
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
VITE_ENABLE_ERROR_TRACKING=true

# =============================================================================
# 🛠️ DEVELOPMENT SETTINGS
# =============================================================================
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=info

# =============================================================================
# 📊 PERFORMANCE SETTINGS
# =============================================================================
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_WEB_VITALS=true

# =============================================================================
# 🔒 SECURITY SETTINGS
# =============================================================================
VITE_ENABLE_CSP=true
VITE_ENABLE_HSTS=false
```

### Step 2: Create `.env.production` for Production

Create a file named `.env.production` in your project root with this content:

```env
# ChainScope Production Environment Configuration

# =============================================================================
# 🔑 REQUIRED: GOOGLE ANALYTICS CONFIGURATION
# =============================================================================
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# =============================================================================
# 🔑 REQUIRED: WALLET CONNECT PROJECT ID
# =============================================================================
VITE_REOWN_PROJECT_ID=your-actual-project-id

# =============================================================================
# 📱 APPLICATION CONFIGURATION
# =============================================================================
VITE_APP_NAME=ChainScope
VITE_APP_URL=https://chainscope.app
VITE_API_BASE_URL=https://api.chainscope.app

# =============================================================================
# ⚙️ FEATURE FLAGS
# =============================================================================
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
VITE_ENABLE_ERROR_TRACKING=true

# =============================================================================
# 🛠️ PRODUCTION SETTINGS
# =============================================================================
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error

# =============================================================================
# 📊 PERFORMANCE SETTINGS
# =============================================================================
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_WEB_VITALS=true

# =============================================================================
# 🔒 SECURITY SETTINGS
# =============================================================================
VITE_ENABLE_CSP=true
VITE_ENABLE_HSTS=true
```

## 🚀 Quick Setup Commands

Run these commands in your terminal to create the environment files:

### For Development:
```bash
# Copy the example file
cp env.example .env.local

# Edit the file with your actual values
# Replace GA_MEASUREMENT_ID with your Google Analytics ID
# Replace demo-project-id with your Reown Project ID
```

### For Production:
```bash
# Copy for production
cp env.example .env.production

# Edit the production file
# Set VITE_DEBUG_MODE=false
# Set VITE_LOG_LEVEL=error
# Update URLs to your production domain
```

## 🔐 Security Notes

1. **Never commit .env files** to version control
2. **Use different Project IDs** for development and production
3. **Keep your keys secure** - they're visible to frontend users
4. **Use environment-specific analytics** to separate dev/prod data

## ✅ Verification

After setting up your environment files, verify they work:

1. Restart your development server
2. Check the browser console for any "GA_MEASUREMENT_ID" or "demo-project-id" warnings
3. Test wallet connect functionality
4. Verify analytics tracking (if configured)

## 🆘 Troubleshooting

### Common Issues:

1. **"GA_MEASUREMENT_ID" appears in console**
   - You haven't replaced the placeholder with your actual Google Analytics ID

2. **Wallet Connect not working**
   - Check that `VITE_REOWN_PROJECT_ID` is set to your actual Project ID
   - Verify the Project ID in Reown Cloud dashboard

3. **Environment variables not loading**
   - Restart your development server after creating/editing .env files
   - Check file names (must be exactly `.env.local` or `.env.production`)

## 📞 Support

If you need help:
1. Check that all required environment variables are set
2. Verify the format of your IDs (Google Analytics should start with G-)
3. Ensure you've restarted the development server after changes