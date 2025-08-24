/**
 * Production Configuration
 * Environment variables for dynamic configuration
 */

export const PRODUCTION_CONFIG = {
  // API Configuration
  API: {
    CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
    REQUEST_TIMEOUT: 10000, // 10 seconds
    MAX_RETRIES: 2,
    MIN_CHAINS_THRESHOLD: parseInt(import.meta.env.MIN_CHAINS_THRESHOLD || '50'),
    MIN_TVL_THRESHOLD: parseInt(import.meta.env.MIN_TVL_THRESHOLD || '1000000'),
    TESTNET_CHAIN_ID_THRESHOLD: parseInt(import.meta.env.TESTNET_CHAIN_ID_THRESHOLD || '1000000'),
    TRUSTED_CHAIN_IDS: import.meta.env.TRUSTED_CHAIN_IDS || '1,10,25,56,100,137,250,324,1101,8453,42161,43114,42220'
  },

  // Chain Data Merger Configuration
  MERGER: {
    MAX_METADATA_CHAINS: parseInt(import.meta.env.MAX_METADATA_CHAINS || '50'),
    MAX_CHAIN_ID: parseInt(import.meta.env.MAX_CHAIN_ID || '10000'),
    POPULAR_CHAIN_IDS: import.meta.env.POPULAR_CHAIN_IDS || '1,137,42161,10,56,43114,250,100,1101,8453',
    RPC_UPDATE_BATCH_SIZE: parseInt(import.meta.env.RPC_UPDATE_BATCH_SIZE || '3'),
    RPC_UPDATE_DELAY_MS: parseInt(import.meta.env.RPC_UPDATE_DELAY_MS || '1000')
  },

  // UI Configuration
  UI: {
    STALE_TIME: 10 * 60 * 1000, // 10 minutes
    CACHE_TIME: 15 * 60 * 1000, // 15 minutes
    FALLBACK_CHAIN_COUNT: 200, // Minimum chains in fallback
    NETWORK_COUNT: import.meta.env.NETWORK_COUNT || '2000+',
    INITIAL_LOAD_SIZE: parseInt(import.meta.env.INITIAL_LOAD_SIZE || '40'),
    LOAD_MORE_SIZE: parseInt(import.meta.env.LOAD_MORE_SIZE || '20')
  },

  // Scoring System
  SCORING: {
    POPULAR_CHAIN_SCORE: parseInt(import.meta.env.POPULAR_CHAIN_SCORE || '1000'),
    VERIFIED_CHAIN_SCORE: parseInt(import.meta.env.VERIFIED_CHAIN_SCORE || '500'),
    RPC_MULTIPLIER: parseInt(import.meta.env.RPC_MULTIPLIER || '10'),
    MAINNET_SCORE: parseInt(import.meta.env.MAINNET_SCORE || '200'),
    L2_SCORE: parseInt(import.meta.env.L2_SCORE || '100')
  },

  // RPC Configuration
  RPC: {
    OFFICIAL_RPC_SCORE_THRESHOLD: parseInt(import.meta.env.OFFICIAL_RPC_SCORE_THRESHOLD || '100'),
    RECOMMENDED_RPC_SCORE_THRESHOLD: parseInt(import.meta.env.RECOMMENDED_RPC_SCORE_THRESHOLD || '50'),
    TOP_RECOMMENDED_RPC_COUNT: parseInt(import.meta.env.TOP_RECOMMENDED_RPC_COUNT || '3')
  },

  // Performance Configuration
  PERFORMANCE: {
    RATE_LIMIT_REQUESTS: parseInt(import.meta.env.RATE_LIMIT_REQUESTS || '100'),
    RATE_LIMIT_WINDOW: parseInt(import.meta.env.RATE_LIMIT_WINDOW || '60000'),
    RPC_TEST_TIMEOUT: parseInt(import.meta.env.RPC_TEST_TIMEOUT || '10000'),
    SLOW_RPC_THRESHOLD: parseInt(import.meta.env.SLOW_RPC_THRESHOLD || '5000')
  }
}

/**
 * Environment Variables Documentation
 * 
 * API Configuration:
 * - MIN_CHAINS_THRESHOLD: Minimum number of chains to consider sufficient data (default: 50)
 * - MIN_TVL_THRESHOLD: Minimum TVL for chain verification (default: 1000000)
 * - TESTNET_CHAIN_ID_THRESHOLD: Chain ID threshold for testnet detection (default: 1000000)
 * - TRUSTED_CHAIN_IDS: Comma-separated list of trusted chain IDs
 * 
 * Chain Data Merger:
 * - MAX_METADATA_CHAINS: Maximum chains to fetch metadata for (default: 50)
 * - MAX_CHAIN_ID: Maximum chain ID to process (default: 10000)
 * - POPULAR_CHAIN_IDS: Comma-separated list of popular chain IDs
 * - RPC_UPDATE_BATCH_SIZE: Number of chains to update RPC health in parallel (default: 3)
 * - RPC_UPDATE_DELAY_MS: Delay between RPC update batches (default: 1000)
 * 
 * UI Configuration:
 * - NETWORK_COUNT: Text to display for network count (default: "2000+")
 * - INITIAL_LOAD_SIZE: Number of chains to load initially (default: 40)
 * - LOAD_MORE_SIZE: Number of chains to load when scrolling (default: 20)
 * 
 * Scoring System:
 * - POPULAR_CHAIN_SCORE: Score bonus for popular chains (default: 1000)
 * - VERIFIED_CHAIN_SCORE: Score bonus for verified chains (default: 500)
 * - RPC_MULTIPLIER: Multiplier for RPC count in scoring (default: 10)
 * - MAINNET_SCORE: Score bonus for mainnet chains (default: 200)
 * - L2_SCORE: Score bonus for L2 chains (default: 100)
 * 
 * RPC Configuration:
 * - OFFICIAL_RPC_SCORE_THRESHOLD: Score threshold for official RPCs (default: 100)
 * - RECOMMENDED_RPC_SCORE_THRESHOLD: Score threshold for recommended RPCs (default: 50)
 * - TOP_RECOMMENDED_RPC_COUNT: Number of top recommended RPCs to show (default: 3)
 * 
 * Performance:
 * - RATE_LIMIT_REQUESTS: Number of requests per rate limit window (default: 100)
 * - RATE_LIMIT_WINDOW: Rate limit window in milliseconds (default: 60000)
 * - RPC_TEST_TIMEOUT: Timeout for RPC testing in milliseconds (default: 10000)
 * - SLOW_RPC_THRESHOLD: Latency threshold for slow RPCs in milliseconds (default: 5000)
 */

// Production-ready error messages
export const ERROR_MESSAGES = {
  API_UNAVAILABLE: 'Network data is temporarily unavailable. Using fallback data.',
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  FALLBACK_ACTIVE: 'Using fallback data while we restore full functionality.',
  PRODUCTION_MODE: 'Production mode active - optimized for performance and reliability.'
}

// Production monitoring events
export const MONITORING_EVENTS = {
  API_SUCCESS: 'api_success',
  API_FAILURE: 'api_failure',
  FALLBACK_ACTIVATED: 'fallback_activated',
  CACHE_HIT: 'cache_hit',
  CACHE_MISS: 'cache_miss',
  USER_SEARCH: 'user_search',
  CHAIN_VIEW: 'chain_view'
}
