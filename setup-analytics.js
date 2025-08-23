#!/usr/bin/env node

/**
 * Google Analytics Setup Script for ChainScope
 * 
 * This script helps you set up Google Analytics by creating the .env file
 * with the correct configuration.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 ChainScope Google Analytics Setup\n');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupAnalytics() {
  try {
    // Check if .env already exists
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Setup cancelled.');
        rl.close();
        return;
      }
    }

    console.log('\n📋 Please provide the following information:\n');

    // Get Google Analytics Measurement ID
    const gaId = await question('🔍 Google Analytics Measurement ID (G-XXXXXXXXXX): ');
    
    if (!gaId || gaId === 'GA_MEASUREMENT_ID') {
      console.log('⚠️  Using placeholder Measurement ID. Analytics will not work until you provide a real ID.');
    }

    // Get other configuration
    const appName = await question('📱 Application Name (default: ChainScope): ') || 'ChainScope';
    const appUrl = await question('🌐 Application URL (default: https://chainscope.app): ') || 'https://chainscope.app';
    const enableAnalytics = await question('📊 Enable Analytics? (Y/n): ') || 'Y';
    const enablePWA = await question('📱 Enable PWA features? (Y/n): ') || 'Y';
    const enableErrorTracking = await question('🚨 Enable Error Tracking? (Y/n): ') || 'Y';

    // Create .env content
    const envContent = `# Google Analytics Configuration
# Replace GA_MEASUREMENT_ID with your actual Google Analytics Measurement ID
# You can find this in your Google Analytics account under Admin > Data Streams > Web Stream
VITE_GA_MEASUREMENT_ID=${gaId || 'GA_MEASUREMENT_ID'}

# Application Configuration
VITE_APP_NAME=${appName}
VITE_APP_URL=${appUrl}
VITE_API_BASE_URL=https://api.chainscope.app

# Feature Flags
VITE_ENABLE_ANALYTICS=${enableAnalytics.toLowerCase() === 'y' || enableAnalytics.toLowerCase() === 'yes' ? 'true' : 'false'}
VITE_ENABLE_PWA=${enablePWA.toLowerCase() === 'y' || enablePWA.toLowerCase() === 'yes' ? 'true' : 'false'}
VITE_ENABLE_ERROR_TRACKING=${enableErrorTracking.toLowerCase() === 'y' || enableErrorTracking.toLowerCase() === 'yes' ? 'true' : 'false'}

# Development Settings
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info

# Performance Settings
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_WEB_VITALS=true

# Security Settings
VITE_ENABLE_CSP=true
VITE_ENABLE_HSTS=true
`;

    // Write .env file
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Environment configuration created successfully!');
    console.log(`📁 File created: ${envPath}`);
    
    if (gaId && gaId !== 'GA_MEASUREMENT_ID') {
      console.log('\n🎉 Google Analytics is now configured!');
      console.log('📊 Next steps:');
      console.log('   1. Restart your development server');
      console.log('   2. Check the browser console for analytics messages');
      console.log('   3. Verify data appears in Google Analytics Real-Time reports');
    } else {
      console.log('\n⚠️  Google Analytics is not fully configured yet.');
      console.log('📝 To complete setup:');
      console.log('   1. Get your Measurement ID from Google Analytics');
      console.log('   2. Update VITE_GA_MEASUREMENT_ID in the .env file');
      console.log('   3. Restart your development server');
    }

    console.log('\n📚 For more information, see: GOOGLE_ANALYTICS_SETUP.md');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
  } finally {
    rl.close();
  }
}

setupAnalytics(); 