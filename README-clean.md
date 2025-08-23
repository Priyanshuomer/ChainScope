# 🔗 ChainScope - The Ultimate Blockchain Network Explorer

> **Discover, Monitor & Connect to 2,000+ Blockchain Networks Instantly**

ChainScope is the definitive blockchain network explorer and RPC directory for developers, traders, and Web3 enthusiasts worldwide. With real-time RPC health monitoring, comprehensive analytics, and instant wallet integration capabilities, ChainScope makes blockchain exploration effortless and reliable.

## 🌟 Key Features

- **🌐 2,000+ Blockchain Networks** - Complete coverage from Ethereum to emerging Layer 2s
- **⚡ Real-Time RPC Monitoring** - Live health checks and performance metrics
- **🔒 Smart RPC Selection** - Automatically selects online, official, and trusted endpoints
- **📱 One-Click Wallet Integration** - Add networks to MetaMask and Web3 wallets instantly
- **📊 Comprehensive Analytics** - Network statistics, trending chains, and performance data
- **🎯 Advanced Search & Filters** - Find networks by name, chain ID, ecosystem, or features
- **📈 Trending Networks** - Discover popular and emerging blockchain networks
- **🔍 Network Comparison** - Compare multiple networks side-by-side

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Analytics Measurement ID (optional)
- Reown/WalletConnect Project ID (for wallet functionality)

### Installation

```bash
# Clone the repository
git clone https://github.com/infinblock-user/chainscope-ca4d51c3.git
cd chainscope

# Install dependencies
npm install

# Set up environment variables
node setup-env.js

# Start development server
npm run dev
```

### Environment Setup

1. **Run the setup script** (recommended):
   ```bash
   node setup-env.js
   ```

2. **Or manually create `.env.local`**:
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_REOWN_PROJECT_ID=your-project-id
   VITE_ENABLE_ANALYTICS=true
   ```

See `ENVIRONMENT_SETUP.md` for detailed configuration instructions.

## 🛠️ Technology Stack

ChainScope is built with modern, production-ready technologies:

### Frontend
- **React 18** - Modern UI framework with hooks and concurrent features
- **TypeScript** - Type-safe development for better code quality
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - High-quality, accessible component library

### Data & APIs
- **TanStack Query** - Powerful data fetching and caching
- **Multiple Data Sources** - ChainList, Ethereum Lists, DefiLlama, GitHub
- **Real-time RPC Monitoring** - Custom health checking system
- **Smart Fallbacks** - 3-tier fallback system for maximum reliability

### Web3 Integration
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **Reown AppKit** - WalletConnect v2 integration
- **MetaMask Support** - Native Web3 wallet integration

### Performance & SEO
- **Code Splitting** - Optimized bundle loading
- **Progressive Web App** - PWA capabilities with offline support
- **Google Analytics** - Comprehensive analytics and performance monitoring
- **SEO Optimized** - Complete meta tags, sitemaps, and structured data

## 🚀 Deployment

### Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**:
   - **Vercel** (Recommended): Connect your GitHub repo
   - **Netlify**: Drag & drop the `dist` folder
   - **AWS S3 + CloudFront**: Upload static files
   - **GitHub Pages**: Enable in repository settings

3. **Configure environment variables** on your hosting platform:
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_REOWN_PROJECT_ID=your-project-id
   VITE_ENABLE_ANALYTICS=true
   ```

### Hosting Recommendations
- **Vercel**: Best for React apps with edge deployment
- **Netlify**: Excellent for JAMstack with form handling
- **AWS CloudFront**: Maximum control and global CDN
- **GitHub Pages**: Free hosting for open source projects

## 📚 Documentation

- **[Environment Setup Guide](ENVIRONMENT_SETUP.md)** - Complete configuration instructions
- **[Production Readiness Audit](PRODUCTION_READINESS_AUDIT.md)** - Security and performance checklist
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Step-by-step deployment instructions
- **[RPC Selection System](RPC_SELECTION_SYSTEM.md)** - Smart RPC endpoint selection
- **[Wallet Configuration](WALLET_CONFIGURATION.md)** - Web3 wallet integration details

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines and follow the development setup above.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the docs folder for comprehensive guides
- **Issues**: Report bugs or request features via GitHub Issues
- **Environment Setup**: Run `node setup-env.js` for interactive setup
