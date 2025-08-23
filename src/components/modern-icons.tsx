// Modern blockchain-specific icons for better UX
import { 
  Globe2, 
  Network, 
  Layers, 
  Shield, 
  Zap, 
  Activity, 
  TrendingUp,
  Coins,
  Link,
  Eye,
  Lock,
  Gauge,
  Server,
  Database,
  CloudLightning,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Cpu,
  HardDrive,
  Wifi,
  Radio,
  Satellite,
  Target,
  Layers3,
  GitBranch,
  Workflow,
  Binary,
  Code2,
  Terminal,
  BarChart3,
  DollarSign
} from "lucide-react"

// Icon mapping for different blockchain contexts
export const CHAIN_ICONS = {
  // Network types
  mainnet: Network,
  testnet: Layers,
  sidechain: GitBranch,
  l2: Layers3,
  rollup: Workflow,
  
  // Security & Privacy
  verified: CheckCircle2,
  unverified: AlertTriangle,
  privacy: Eye,
  security: Shield,
  encrypted: Lock,
  
  // Performance
  latency: Clock,
  speed: Zap,
  performance: Gauge,
  uptime: Activity,
  health: TrendingUp,
  
  // Infrastructure
  rpc: Server,
  node: Database,
  endpoint: Radio,
  bridge: Link,
  oracle: Satellite,
  
  // Technical
  evm: Terminal,
  consensus: Target,
  validator: Fingerprint,
  smart_contract: Code2,
  virtual_machine: Cpu,
  
  // Analytics
  metrics: BarChart3,
  monitoring: Wifi,
  analytics: TrendingUp,
  data: HardDrive,
  
  // Economics
  currency: Coins,
  fee: DollarSign,
  gas: CloudLightning,
  staking: Layers,
  
  // Geographic
  global: Globe2,
  region: MapPin,
  distributed: Network
} as const

// Get contextual icon for chain properties
export const getChainTypeIcon = (chain: { isTestnet?: boolean; parent?: unknown }) => {
  if (chain.isTestnet) return CHAIN_ICONS.testnet
  if (chain.parent) return CHAIN_ICONS.l2
  return CHAIN_ICONS.mainnet
}

export const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'online':
      return CHAIN_ICONS.health
    case 'deprecated':
    case 'offline':
      return AlertTriangle
    default:
      return CHAIN_ICONS.performance
  }
}

export const getFeatureIcon = (feature: string) => {
  const lower = feature.toLowerCase()
  
  if (lower.includes('evm')) return CHAIN_ICONS.evm
  if (lower.includes('bridge')) return CHAIN_ICONS.bridge
  if (lower.includes('staking')) return CHAIN_ICONS.staking
  if (lower.includes('oracle')) return CHAIN_ICONS.oracle
  if (lower.includes('privacy')) return CHAIN_ICONS.privacy
  if (lower.includes('smart')) return CHAIN_ICONS.smart_contract
  
  return Binary
}

export const getPerformanceIcon = (metric: string) => {
  switch (metric.toLowerCase()) {
    case 'latency':
      return CHAIN_ICONS.latency
    case 'uptime':
      return CHAIN_ICONS.uptime
    case 'speed':
      return CHAIN_ICONS.speed
    case 'health':
      return CHAIN_ICONS.health
    default:
      return CHAIN_ICONS.performance
  }
}