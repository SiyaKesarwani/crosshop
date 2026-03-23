/**
 * Relayer Configuration
 * Maps supported networks and their RPC endpoints
 */

module.exports = {
  // Network configurations
  networks: {
    sepolia: {
      chainId: 11155111,
      rpcUrl: process.env.SEPOLIA_API || "https://rpc.sepolia.org",
      crossHopAddress: process.env.SEPOLIA_CROSSHOP_ADDRESS,
      confirmations: 6,
    },
    arbiSepolia: {
      chainId: 421614,
      rpcUrl: process.env.ARBI_SEPOLIA_API || "https://sepolia-rollup.arbitrum.io/rpc",
      crossHopAddress: process.env.ARBI_SEPOLIA_CROSSHOP_ADDRESS,
      confirmations: 6,
    },
    optiSepolia: {
      chainId: 11155420,
      rpcUrl: process.env.OPTI_SEPOLIA_API || "https://sepolia.optimism.io",
      crossHopAddress: process.env.OPTI_SEPOLIA_CROSSHOP_ADDRESS,
      confirmations: 6,
    },
    amoy: {
      chainId: 80002,
      rpcUrl: process.env.AMOY_API || "https://rpc-amoy.polygon.technology",
      crossHopAddress: process.env.AMOY_CROSSHOP_ADDRESS,
      confirmations: 6,
    },
    bnbTestnet: {
      chainId: 97,
      rpcUrl: process.env.BNBTESTNET_API || "https://data-seed-prebsc-1-b.binance.org:8545",
      crossHopAddress: process.env.BNBTESTNET_CROSSHOP_ADDRESS,
      confirmations: 6,
    },
    fantomTestnet: {
      chainId: 4002,
      rpcUrl: process.env.FANTOMTESTNET_API || "https://rpc.testnet.fantom.network",
      crossHopAddress: process.env.FANTOMTESTNET_CROSSHOP_ADDRESS,
      confirmations: 6,
    },
  },

  // Relayer configuration
  relayer: {
    // Private key of the relayer (node group) account
    privateKey: process.env.RELAYER_PRIVATE_KEY,

    // Gas price multiplier for faster transactions
    gasMultiplier: process.env.GAS_MULTIPLIER || 1.2,

    // Maximum retry attempts for failed transactions
    maxRetries: process.env.MAX_RETRIES || 3,

    // Retry delay in milliseconds
    retryDelayMs: process.env.RETRY_DELAY || 5000,

    // Poll interval for checking new events (ms)
    pollIntervalMs: process.env.POLL_INTERVAL || 12000,

    // Fee percentage taken by relayer (in basis points, e.g., 10 = 0.1%)
    feePercentage: process.env.FEE_PERCENTAGE || 10,

    // Batch size for relay operations
    batchSize: process.env.BATCH_SIZE || 5,
  },

  // Database path for tracking processed transactions
  dbPath: process.env.DB_PATH || "./relayer/data/processed.json",

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || "info",
    file: process.env.LOG_FILE || "./relayer/logs/relayer.log",
  },

  // Chain pairs for relaying (source -> destination)
  chainPairs: [
    { source: "sepolia", destination: "arbiSepolia" },
    { source: "arbiSepolia", destination: "sepolia" },
    { source: "sepolia", destination: "optiSepolia" },
    { source: "optiSepolia", destination: "sepolia" },
  ],
};
