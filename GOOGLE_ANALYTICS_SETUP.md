# Google Analytics Setup Guide for ChainScope

## Overview

ChainScope has a built-in analytics system that supports Google Analytics. This guide will help you set up Google Analytics properly for your platform.

## Current Cookie Usage

Your platform currently uses cookies for:
- **Sidebar State**: Remembers if the sidebar is open/closed (7-day expiration)
- **Future Analytics**: Ready for Google Analytics cookies when configured

## Step-by-Step Google Analytics Setup

### 1. Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Follow the setup wizard to create your account
4. Create a new property for ChainScope

### 2. Get Your Measurement ID

1. In Google Analytics, go to **Admin** (gear icon)
2. Under **Property**, click **Data Streams**
3. Click **Web** and then **Add stream**
4. Enter your website URL: `https://chainscope.app`
5. Give it a name like "ChainScope Website"
6. Copy the **Measurement ID** (format: G-XXXXXXXXXX)

### 3. Configure Environment Variables

Create a `.env` file in your project root (or add to your deployment environment):

```env
# Google Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true

# Application Configuration
VITE_APP_NAME=ChainScope
VITE_APP_URL=https://chainscope.app
VITE_API_BASE_URL=https://api.chainscope.app

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ERROR_TRACKING=true

# Development Settings
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info

# Performance Settings
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_WEB_VITALS=true

# Security Settings
VITE_ENABLE_CSP=true
VITE_ENABLE_HSTS=true
```

**Important**: Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 4. Environment Configuration

The Google Analytics setup is now fully automated! The system will:

1. **Automatically detect** your Measurement ID from environment variables
2. **Load Google Analytics** only when properly configured
3. **Respect privacy settings** and disable analytics when `VITE_ENABLE_ANALYTICS=false`
4. **Handle development vs production** environments automatically

No manual HTML editing required!

### 5. Verify Setup

1. **Create your `.env` file** with your Measurement ID
2. **Restart your development server** or deploy your changes
3. **Visit your website**
4. **Open browser developer tools** and check the Console
5. **Look for one of these messages**:
   - ✅ `"📊 Analytics initialized with Google Analytics"` (if properly configured)
   - ℹ️ `"📊 Analytics initialized (Google Analytics Measurement ID not configured)"` (if ID not set)
   - 🔇 `"📊 Analytics disabled via environment variable"` (if disabled)
6. **Check the Network tab** for requests to `googletagmanager.com` (only if enabled)
7. **In Google Analytics**, check Real-Time reports to see if data is coming in

### 6. Testing Different Scenarios

**To test without Google Analytics:**
```env
VITE_ENABLE_ANALYTICS=false
```

**To test with placeholder (no real tracking):**
```env
VITE_GA_MEASUREMENT_ID=GA_MEASUREMENT_ID
VITE_ENABLE_ANALYTICS=true
```

**To test with real Google Analytics:**
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
```

## What Gets Tracked

Once configured, Google Analytics will track:

### Page Views
- All page visits
- Page titles and URLs
- Referrer information

### Custom Events
- **Chain Views**: When users view specific blockchain networks
- **Search**: Search queries and result counts
- **RPC Copy**: When users copy RPC endpoints
- **Wallet Connect**: When users connect wallets to networks

### Performance Metrics
- Page load times
- Web Vitals (Core Web Vitals)
- API response times
- Component render times

### Error Tracking
- JavaScript errors
- Unhandled promise rejections
- React component errors

## Privacy and GDPR Compliance

Your platform is already GDPR-compliant with:

1. **Cookie Policy**: Comprehensive cookie policy page
2. **Privacy Policy**: Detailed privacy policy
3. **User Consent**: Analytics only runs when properly configured
4. **Data Minimization**: Only essential data is collected

## Troubleshooting

### Analytics Not Working
1. Check if `VITE_GA_MEASUREMENT_ID` is set correctly
2. Verify the Measurement ID in `index.html`
3. Check browser console for errors
4. Ensure no ad blockers are blocking Google Analytics

### No Data in Google Analytics
1. Wait 24-48 hours for data to appear
2. Check Real-Time reports for immediate feedback
3. Verify your domain is correct in Google Analytics
4. Check if your Measurement ID is correct

### Development vs Production
- Analytics works in both environments
- Use different Measurement IDs for dev/prod if needed
- Development logs are more verbose for debugging

## Advanced Configuration

### Custom Dimensions
You can add custom dimensions in Google Analytics for:
- Chain ID tracking
- User session analysis
- Performance monitoring

### Enhanced Ecommerce
Consider enabling Enhanced Ecommerce if you plan to add premium features.

### Goals and Conversions
Set up goals for:
- Chain detail page visits
- RPC endpoint copies
- Wallet connections
- Search usage

## Security Considerations

1. **CSP Headers**: Google Analytics domains are already allowed in your CSP
2. **Data Privacy**: No personally identifiable information is sent to GA
3. **Secure Cookies**: All cookies use secure flags
4. **HTTPS Only**: Analytics only works over HTTPS

## Support

If you need help with Google Analytics setup:
1. Check the [Google Analytics Help Center](https://support.google.com/analytics/)
2. Review your browser's developer console for errors
3. Verify your Measurement ID is correct
4. Ensure your domain is properly configured in GA

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics Measurement ID | Yes | `G-XXXXXXXXXX` |
| `VITE_ENABLE_ANALYTICS` | Enable/disable analytics | No | `true` |
| `VITE_APP_NAME` | Application name | No | `ChainScope` |
| `VITE_APP_URL` | Application URL | No | `https://chainscope.app` | 