#!/usr/bin/env node

/**
 * ChainScope Environment Setup Script
 * Automatically creates .env.local and .env.production files with proper configuration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEnvironment() {
  console.log('🔧 ChainScope Environment Setup');
  console.log('=====================================\n');

  try {
    // Get Google Analytics ID
    const gaId = await question('📊 Enter your Google Analytics Measurement ID (G-XXXXXXXXXX) [or press Enter to skip]: ');
    
    // Get Reown Project ID
    const reownProjectId = await question('🔗 Enter your Reown/WalletConnect Project ID [or press Enter to use demo]: ');
    
    // Get app configuration
    const appName = await question('📱 Enter your app name [ChainScope]: ') || 'ChainScope';
    const prodUrl = await question('🌐 Enter your production URL [https://chainscope.app]: ') || 'https://chainscope.app';

    // Create development .env.local
    const devEnvContent = `# ChainScope Development Environment Configuration
# Generated automatically by setup-env.js

# =============================================================================
# 🔑 GOOGLE ANALYTICS CONFIGURATION
# =============================================================================
VITE_GA_MEASUREMENT_ID=${gaId || 'GA_MEASUREMENT_ID'}

# =============================================================================
# 🔑 WALLET CONNECT PROJECT ID
# =============================================================================
VITE_REOWN_PROJECT_ID=${reownProjectId || 'demo-project-id'}

# =============================================================================
# 📱 APPLICATION CONFIGURATION
# =============================================================================
VITE_APP_NAME=${appName}
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
`;

    // Create production .env.production
    const prodEnvContent = `# ChainScope Production Environment Configuration
# Generated automatically by setup-env.js

# =============================================================================
# 🔑 GOOGLE ANALYTICS CONFIGURATION
# =============================================================================
VITE_GA_MEASUREMENT_ID=${gaId || 'G-XXXXXXXXXX'}

# =============================================================================
# 🔑 WALLET CONNECT PROJECT ID
# =============================================================================
VITE_REOWN_PROJECT_ID=${reownProjectId || 'your-actual-project-id'}

# =============================================================================
# 📱 APPLICATION CONFIGURATION
# =============================================================================
VITE_APP_NAME=${appName}
VITE_APP_URL=${prodUrl}
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
`;

    // Write files
    const devEnvPath = path.join(process.cwd(), '.env.local');
    const prodEnvPath = path.join(process.cwd(), '.env.production');

    fs.writeFileSync(devEnvPath, devEnvContent);
    fs.writeFileSync(prodEnvPath, prodEnvContent);

    console.log('\n✅ Environment files created successfully!');
    console.log(`📁 Development file: ${devEnvPath}`);
    console.log(`📁 Production file: ${prodEnvPath}`);
    
    if (!gaId || gaId === 'GA_MEASUREMENT_ID') {
      console.log('\n⚠️  IMPORTANT: You need to update your Google Analytics Measurement ID');
      console.log('   1. Go to https://analytics.google.com/');
      console.log('   2. Create a property and get your Measurement ID');
      console.log('   3. Replace the placeholder in your .env files');
    }

    if (!reownProjectId || reownProjectId === 'demo-project-id') {
      console.log('\n⚠️  IMPORTANT: You need to update your Reown Project ID for wallet functionality');
      console.log('   1. Go to https://cloud.reown.com/');
      console.log('   2. Create a project and get your Project ID');
      console.log('   3. Replace the placeholder in your .env files');
    }

    console.log('\n🚀 Next steps:');
    console.log('   1. Restart your development server');
    console.log('   2. Test the application functionality');
    console.log('   3. Update any placeholder values as needed');

  } catch (error) {
    console.error('❌ Error setting up environment:', error.message);
  } finally {
    rl.close();
  }
}

// Run the setup
setupEnvironment();