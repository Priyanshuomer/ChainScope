# RPC Selection System - Official Endpoints for Wallet Integration

## Overview

ChainScope now implements an intelligent RPC endpoint selection system that prioritizes **official and online RPC endpoints** for wallet network addition, similar to how [ChainList](https://chainlist.org/) and [Ethereum Lists](https://github.com/ethereum-lists/chains) handle network configuration. This ensures users get reliable, fast, and secure RPC endpoints when adding networks to their wallets.

## Problem Solved

### Previous Issues
- **Offline RPCs**: Users were getting offline or unreliable RPC endpoints
- **"Error while connecting to the custom network"**: Caused by invalid or offline RPC URLs
- **Poor Performance**: Slow or unresponsive RPC endpoints
- **Security Concerns**: Untrusted or malicious RPC providers

### Current Solution
- **Official RPC Priority**: Always selects official network RPCs first
- **Online Status Check**: Only uses endpoints marked as "online"
- **Performance Scoring**: Ranks endpoints by latency and reliability
- **Security Validation**: Filters out untrusted or local endpoints

## RPC Selection Algorithm

### 1. Official RPC Patterns
The system recognizes official RPC patterns for major networks:

```typescript
const OFFICIAL_RPC_PATTERNS = [
  // Ethereum Foundation
  /^https:\/\/mainnet\.infura\.io\/v3\//,
  /^https:\/\/eth-mainnet\.alchemyapi\.io\/v2\//,
  /^https:\/\/rpc\.ankr\.com\/eth/,
  
  // Polygon
  /^https:\/\/polygon-rpc\.com/,
  /^https:\/\/rpc-mainnet\.matic\.network/,
  
  // Arbitrum
  /^https:\/\/arb1\.arbitrum\.io\/rpc/,
  
  // Optimism
  /^https:\/\/mainnet\.optimism\.io/,
  
  // Base
  /^https:\/\/mainnet\.base\.org/,
  
  // And many more...
]
```

### 2. Reliable Provider Recognition
Known reliable RPC providers get priority:

```typescript
const RELIABLE_PROVIDERS = [
  'infura.io',
  'alchemyapi.io',
  'ankr.com',
  'thirdweb.com',
  'quicknode.com',
  'binance.org',
  'avax.network',
  'ftm.tools',
  'gnosischain.com',
  'polygon-rpc.com',
  'arbitrum.io',
  'optimism.io',
  'base.org'
]
```

### 3. Scoring System
Each RPC endpoint is scored based on multiple factors:

| Factor | Points | Description |
|--------|--------|-------------|
| Official Pattern | +100 | Matches known official RPC patterns |
| Reliable Provider | +50 | From trusted RPC provider |
| Online Status | +75 | Endpoint is currently online |
| Low Latency | +30 | Response time < 100ms |
| High Reliability | +25 | Reliability score > 90% |
| High Privacy | +20 | No tracking or data collection |
| Open Source | +15 | Open source RPC implementation |
| HTTPS | +10 | Secure connection |
| Local/Private IP | -1000 | Penalty for localhost/private IPs |

## Implementation Details

### Core Functions

#### `getWalletRpcEndpoints(chain: ChainData): string[]`
Selects the best RPC endpoints for wallet network addition:
1. Prioritizes tested endpoints with "online" status
2. Falls back to untested URLs with pattern matching
3. Returns up to 3 best endpoints

#### `selectBestRpcEndpoints(chain: ChainData, maxCount: number): string[]`
Advanced selection with custom count limit:
1. Scores all available endpoints
2. Filters out offline endpoints
3. Sorts by score (highest first)
4. Returns top N endpoints

#### `scoreRpcEndpoint(rpc: RPCEndpoint | string): number`
Calculates a score for any RPC endpoint:
1. Checks official patterns
2. Validates provider reliability
3. Considers performance metrics
4. Applies security penalties

### Usage in Components

#### Wallet Connect Dialog
```typescript
// Get the best RPC endpoints for this chain
const selectedRpcEndpoints = getWalletRpcEndpoints(chain)

// Show selected endpoints to user
{selectedRpcEndpoints.map((rpc, index) => (
  <div key={index} className="flex items-center gap-2 text-xs">
    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    <span className="font-mono text-muted-foreground truncate">{rpc}</span>
  </div>
))}
```

#### Network Addition
```typescript
// Use official RPCs for wallet network addition
const networkConfig = {
  chainId: `0x${chainData.chainId.toString(16)}`,
  chainName: chainData.name,
  nativeCurrency: chainData.nativeCurrency,
  rpcUrls: getWalletRpcEndpoints(chainData), // Official RPCs only
  blockExplorerUrls: chainData.explorers?.length > 0 
    ? [chainData.explorers[0].url] 
    : undefined
}
```

## Benefits

### For Users
- **Reliable Connections**: Always get working RPC endpoints
- **Fast Performance**: Low latency, high reliability endpoints
- **Security**: Only trusted, official RPC providers
- **No Errors**: Eliminates "Error while connecting to the custom network"

### For Developers
- **Consistent Experience**: Same reliable endpoints across all networks
- **Reduced Support**: Fewer wallet connection issues
- **Better UX**: Users see which RPCs are being used
- **Maintainable**: Centralized RPC selection logic

### For the Platform
- **Professional Quality**: Matches industry standards (ChainList, Ethereum Lists)
- **Scalable**: Easy to add new official RPC patterns
- **Monitored**: Can track RPC performance and reliability
- **Trusted**: Users know they're getting official endpoints

## Network Examples

### Ethereum Mainnet
**Selected RPCs:**
- `https://mainnet.infura.io/v3/...` (Official Infura)
- `https://eth-mainnet.alchemyapi.io/v2/...` (Official Alchemy)
- `https://rpc.ankr.com/eth` (Official Ankr)

### Polygon
**Selected RPCs:**
- `https://polygon-rpc.com` (Official Polygon)
- `https://rpc-mainnet.matic.network` (Official Matic)
- `https://polygon.rpc.thirdweb.com` (ThirdWeb)

### Arbitrum One
**Selected RPCs:**
- `https://arb1.arbitrum.io/rpc` (Official Arbitrum)
- `https://arbitrum-one.rpc.thirdweb.com` (ThirdWeb)
- `https://rpc.ankr.com/arbitrum_one` (Ankr)

## Error Handling

### No Valid RPCs Found
```typescript
if (selectedRpcEndpoints.length === 0) {
  throw new Error('No valid RPC URLs found for this network. Please try adding the network manually.')
}
```

### Invalid Network Data
```typescript
const validation = validateChainData(chainData)
if (!validation.isValid) {
  throw new Error(`Invalid chain data: ${validation.issues.join(', ')}`)
}
```

### Wallet Rejection
```typescript
if (error.message?.includes('User rejected')) {
  toast({
    title: "Request Cancelled",
    description: "You declined to add the network to your wallet.",
    variant: "destructive",
  })
}
```

## Future Enhancements

### Planned Features
- **Real-time RPC Testing**: Continuous monitoring of endpoint health
- **User Preferences**: Allow users to choose preferred RPC providers
- **Geographic Optimization**: Select RPCs based on user location
- **Load Balancing**: Distribute requests across multiple endpoints

### Monitoring
- **Performance Metrics**: Track latency and reliability
- **Error Tracking**: Monitor failed network additions
- **User Feedback**: Collect feedback on RPC performance
- **Provider Analytics**: Analyze which providers work best

---

*This RPC selection system ensures ChainScope provides the same level of reliability and trust as industry leaders like ChainList and Ethereum Lists, while maintaining the platform's unique features and user experience.* 