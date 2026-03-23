/**
 * Event Listener for CrossHop bridge events
 */

const { ethers } = require("ethers");

class EventListener {
  constructor(provider, crossHopAddress, logger) {
    this.provider = provider;
    this.crossHopAddress = crossHopAddress;
    this.logger = logger;

    // CrossHop ABI (minimal, only events we care about)
    this.abi = [
      "event TokenDeposit(address indexed to, uint256 chainId, address indexed token, uint256 amount)",
      "event TokenRedeem(address indexed to, uint256 chainId, address indexed token, uint256 amount)",
      "event TokenDepositAndSwap(address indexed to, uint256 chainId, address indexed token, uint256 amount, uint8 tokenIndexFrom, uint8 tokenIndexTo, uint256 minDy, uint256 deadline)",
      "event TokenRedeemAndSwap(address indexed to, uint256 chainId, address indexed token, uint256 amount, uint8 tokenIndexFrom, uint8 tokenIndexTo, uint256 minDy, uint256 deadline)",
    ];

    this.contract = new ethers.Contract(crossHopAddress, this.abi, provider);
  }

  /**
   * Listen for TokenDeposit events
   */
  async onTokenDeposit(callback) {
    this.contract.on("TokenDeposit", (to, chainId, token, amount, event) => {
      callback({
        eventType: "TokenDeposit",
        to,
        chainId: chainId.toNumber(),
        token,
        amount: amount.toString(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        logIndex: event.logIndex,
      });
    });
  }

  /**
   * Listen for TokenRedeem events
   */
  async onTokenRedeem(callback) {
    this.contract.on("TokenRedeem", (to, chainId, token, amount, event) => {
      callback({
        eventType: "TokenRedeem",
        to,
        chainId: chainId.toNumber(),
        token,
        amount: amount.toString(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        logIndex: event.logIndex,
      });
    });
  }

  /**
   * Listen for TokenDepositAndSwap events
   */
  async onTokenDepositAndSwap(callback) {
    this.contract.on(
      "TokenDepositAndSwap",
      (to, chainId, token, amount, tokenIndexFrom, tokenIndexTo, minDy, deadline, event) => {
        callback({
          eventType: "TokenDepositAndSwap",
          to,
          chainId: chainId.toNumber(),
          token,
          amount: amount.toString(),
          tokenIndexFrom,
          tokenIndexTo,
          minDy: minDy.toString(),
          deadline: deadline.toString(),
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          logIndex: event.logIndex,
        });
      }
    );
  }

  /**
   * Listen for TokenRedeemAndSwap events
   */
  async onTokenRedeemAndSwap(callback) {
    this.contract.on(
      "TokenRedeemAndSwap",
      (to, chainId, token, amount, tokenIndexFrom, tokenIndexTo, minDy, deadline, event) => {
        callback({
          eventType: "TokenRedeemAndSwap",
          to,
          chainId: chainId.toNumber(),
          token,
          amount: amount.toString(),
          tokenIndexFrom,
          tokenIndexTo,
          minDy: minDy.toString(),
          deadline: deadline.toString(),
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          logIndex: event.logIndex,
        });
      }
    );
  }

  /**
   * Get historical events (for catch-up)
   */
  async getHistoricalEvents(eventName, fromBlock = 0) {
    try {
      const events = await this.contract.queryFilter(eventName, fromBlock);
      return events.map((event) => ({
        eventType: eventName,
        ...event.args,
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        logIndex: event.logIndex,
      }));
    } catch (err) {
      this.logger.error("Error fetching historical events", { eventName, fromBlock, error: err.message });
      return [];
    }
  }

  /**
   * Stop listening to all events
   */
  stopListening() {
    this.contract.removeAllListeners();
  }
}

module.exports = EventListener;
