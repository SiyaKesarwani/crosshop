/**
 * Main Relayer Service
 * Orchestrates listening to events and relaying them across chains
 */

const { ethers } = require("ethers");
const EventListener = require("../listeners/eventListener");
const RelayExecutor = require("../executor/relayExecutor");
const ProcessedDatabase = require("../utils/database");
const Logger = require("../utils/logger");
const config = require("../config");

class RelayerService {
  constructor() {
    this.logger = new Logger(config.logging.file);
    this.database = new ProcessedDatabase(config.dbPath);
    this.eventListeners = {};
    this.relayExecutor = null;
    this.isRunning = false;
    this.eventQueue = [];
  }

  /**
   * Initialize the relayer service
   */
  async initialize() {
    try {
      this.logger.info("=== Starting RelayerService ===");

      // Validate configuration
      if (!config.relayer.privateKey) {
        throw new Error("RELAYER_PRIVATE_KEY not set in environment variables");
      }

      // Setup relayer wallet
      this.relayerWallet = new ethers.Wallet(config.relayer.privateKey);
      this.logger.info("Relayer wallet initialized", { address: this.relayerWallet.address });

      // Initialize relay executor
      this.relayExecutor = new RelayExecutor(this.relayerWallet, config, this.logger);

      // Setup event listeners for each network
      await this.setupEventListeners();

      this.isRunning = true;
      this.logger.info("RelayerService initialized successfully");
    } catch (err) {
      this.logger.error("Failed to initialize RelayerService", { error: err.message });
      throw err;
    }
  }

  /**
   * Setup event listeners for all networks
   */
  async setupEventListeners() {
    for (const [networkName, networkConfig] of Object.entries(config.networks)) {
      try {
        const provider = new ethers.providers.JsonRpcProvider(networkConfig.rpcUrl);
        const network = await provider.getNetwork();

        if (network.chainId !== networkConfig.chainId) {
          this.logger.warn(`Chain ID mismatch for ${networkName}`, {
            expected: networkConfig.chainId,
            actual: network.chainId,
          });
          continue;
        }

        const listener = new EventListener(provider, networkConfig.crossHopAddress, this.logger);
        this.eventListeners[networkName] = {
          listener,
          provider,
          network: networkName,
          crossHopAddress: networkConfig.crossHopAddress,
        };

        this.logger.info(`Event listener setup for ${networkName}`, {
          chainId: network.chainId,
          crossHopAddress: networkConfig.crossHopAddress,
        });
      } catch (err) {
        this.logger.error(`Failed to setup listener for ${networkName}`, { error: err.message });
      }
    }
  }

  /**
   * Start listening to events
   */
  async start() {
    try {
      await this.initialize();

      // Setup event handlers
      for (const [networkName, listenerData] of Object.entries(this.eventListeners)) {
        const { listener, network } = listenerData;

        // Listen for TokenDeposit events
        listener.onTokenDeposit(async (event) => {
          this.logger.info("TokenDeposit event detected", { sourceChain: networkName });
          this.enqueueEvent({
            ...event,
            sourceChain: networkName,
            destChainId: event.chainId,
          });
        });

        // Listen for TokenRedeem events
        listener.onTokenRedeem(async (event) => {
          this.logger.info("TokenRedeem event detected", { sourceChain: networkName });
          this.enqueueEvent({
            ...event,
            sourceChain: networkName,
            destChainId: event.chainId,
          });
        });

        // Listen for TokenDepositAndSwap events
        listener.onTokenDepositAndSwap(async (event) => {
          this.logger.info("TokenDepositAndSwap event detected", { sourceChain: networkName });
          this.enqueueEvent({
            ...event,
            sourceChain: networkName,
            destChainId: event.chainId,
          });
        });

        // Listen for TokenRedeemAndSwap events
        listener.onTokenRedeemAndSwap(async (event) => {
          this.logger.info("TokenRedeemAndSwap event detected", { sourceChain: networkName });
          this.enqueueEvent({
            ...event,
            sourceChain: networkName,
            destChainId: event.chainId,
          });
        });
      }

      // Start processing event queue
      this.startEventProcessor();

      this.logger.info("Relayer service started and listening for events");
    } catch (err) {
      this.logger.error("Failed to start relayer service", { error: err.message });
      throw err;
    }
  }

  /**
   * Enqueue event for processing
   */
  enqueueEvent(event) {
    this.eventQueue.push(event);
    this.logger.debug("Event enqueued", { queueSize: this.eventQueue.length });
  }

  /**
   * Process events from queue
   */
  startEventProcessor() {
    setInterval(async () => {
      if (this.eventQueue.length > 0) {
        const event = this.eventQueue.shift();
        await this.processEvent(event);
      }
    }, 1000);
  }

  /**
   * Process a single event
   */
  async processEvent(event) {
    try {
      // Generate kappa to check if already processed
      const kappa = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(event.transactionHash));

      if (this.database.isProcessed(kappa)) {
        this.logger.warn("Event already processed, skipping", { kappa });
        return;
      }

      // Find destination network based on destination chainId
      let destinationNetwork = null;
      for (const [networkName, networkConfig] of Object.entries(config.networks)) {
        if (networkConfig.chainId === event.destChainId) {
          destinationNetwork = networkName;
          break;
        }
      }

      if (!destinationNetwork) {
        this.logger.error("No destination network found for chainId", { chainId: event.destChainId });
        return;
      }

      // Mark as processing
      this.database.markProcessed(kappa, {
        txHash: event.transactionHash,
        sourceChain: event.sourceChain,
        destinationChain: destinationNetwork,
        eventType: event.eventType,
        status: "processing",
      });

      // Relay event based on type
      let relayResult;
      switch (event.eventType) {
        case "TokenDeposit":
          relayResult = await this.relayExecutor.relayTokenDeposit(event, destinationNetwork, event.destChainId);
          break;
        case "TokenRedeem":
          relayResult = await this.relayExecutor.relayTokenRedeem(event, destinationNetwork, event.destChainId);
          break;
        case "TokenDepositAndSwap":
          relayResult = await this.relayExecutor.relayTokenDepositAndSwap(event, destinationNetwork);
          break;
        case "TokenRedeemAndSwap":
          relayResult = await this.relayExecutor.relayTokenRedeemAndSwap(event, destinationNetwork);
          break;
        default:
          this.logger.warn("Unknown event type", { eventType: event.eventType });
          return;
      }

      if (relayResult.success) {
        this.database.updateRelayTxHash(kappa, relayResult.txHash, "confirmed");
        this.logger.info("Event relayed successfully", {
          txHash: event.transactionHash,
          relayTxHash: relayResult.txHash,
        });
      } else {
        this.logger.warn("Failed to relay event", {
          txHash: event.transactionHash,
          reason: relayResult.reason || relayResult.error,
        });
        this.database.updateRelayTxHash(kappa, null, "failed");
      }
    } catch (err) {
      this.logger.error("Error processing event", { error: err.message });
    }
  }

  /**
   * Get relayer statistics
   */
  getStats() {
    const processed = this.database.getProcessed();
    const total = Object.keys(processed).length;
    const confirmed = Object.values(processed).filter((p) => p.status === "confirmed").length;
    const failed = Object.values(processed).filter((p) => p.status === "failed").length;
    const pending = Object.values(processed).filter((p) => p.status === "processing").length;

    return {
      isRunning: this.isRunning,
      relayerAddress: this.relayerWallet?.address,
      eventQueueSize: this.eventQueue.length,
      processedTransactions: {
        total,
        confirmed,
        failed,
        pending,
      },
    };
  }

  /**
   * Stop the relayer service
   */
  stop() {
    try {
      this.isRunning = false;
      for (const listenerData of Object.values(this.eventListeners)) {
        listenerData.listener.stopListening();
      }
      this.logger.info("Relayer service stopped");
    } catch (err) {
      this.logger.error("Error stopping relayer service", { error: err.message });
    }
  }
}

module.exports = RelayerService;
