/**
 * Relay Executor - Handles relaying events to destination chain
 */

const { ethers } = require("ethers");

class RelayExecutor {
  constructor(relayerWallet, config, logger) {
    this.relayerWallet = relayerWallet;
    this.config = config;
    this.logger = logger;

    // CrossHop MintAndSwap ABI
    this.crossHopAbi = [
      "function mint(address payable to, address token, uint256 amount, uint256 fee, bytes32 kappa) external",
      "function withdraw(address to, address token, uint256 amount, uint256 fee, bytes32 kappa) external",
      "function mintAndSwap(address payable to, address token, uint256 amount, uint256 fee, uint8 tokenIndexFrom, uint8 tokenIndexTo, uint256 minDy, uint256 deadline, bytes32 kappa) external",
      "function withdrawAndSwap(address to, address token, uint256 amount, uint256 fee, uint8 tokenIndexFrom, uint8 tokenIndexTo, uint256 minDy, uint256 deadline, bytes32 kappa) external",
      "function kappaExists(bytes32 kappa) external view returns (bool)",
    ];
  }

  /**
   * Generate kappa from transaction hash
   */
  generateKappa(txHash) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(txHash));
  }

  /**
   * Calculate relay fee based on event data
   */
  calculateFee(amount) {
    const feePercentage = this.config.relayer.feePercentage || 10; // basis points
    return ethers.BigNumber.from(amount).mul(feePercentage).div(10000);
  }

  /**
   * Check if kappa already exists on destination chain (prevent replay)
   */
  async kappaExists(destinationProvider, crossHopAddress, kappa) {
    try {
      const contract = new ethers.Contract(crossHopAddress, this.crossHopAbi, destinationProvider);
      return await contract.kappaExists(kappa);
    } catch (err) {
      this.logger.error("Error checking kappa existence", { error: err.message });
      return false;
    }
  }

  /**
   * Relay TokenDeposit event -> Call mint() on destination
   */
  async relayTokenDeposit(event, destinationNetwork, destinationChainId) {
    try {
      this.logger.info("Relaying TokenDeposit event", {
        to: event.to,
        token: event.token,
        amount: event.amount,
        destinationChain: destinationNetwork,
      });

      const kappa = this.generateKappa(event.transactionHash);
      const provider = new ethers.providers.JsonRpcProvider(this.config.networks[destinationNetwork].rpcUrl);
      const crossHopAddress = this.config.networks[destinationNetwork].crossHopAddress;

      // Check if already processed
      const exists = await this.kappaExists(provider, crossHopAddress, kappa);
      if (exists) {
        this.logger.warn("Kappa already exists (replay prevention)", { kappa });
        return { success: false, reason: "Kappa already processed" };
      }

      // Get destination chain ID
      const network = await provider.getNetwork();
      if (network.chainId !== this.config.networks[destinationNetwork].chainId) {
        throw new Error(`Chain ID mismatch: expected ${this.config.networks[destinationNetwork].chainId}, got ${network.chainId}`);
      }

      // Calculate fee
      const fee = this.calculateFee(event.amount);

      // Prepare transaction
      const contract = new ethers.Contract(
        crossHopAddress,
        this.crossHopAbi,
        this.relayerWallet.connect(provider)
      );

      const tx = await contract.mint(
        event.to,
        event.token,
        event.amount,
        fee.toString(),
        kappa,
        {
          gasLimit: 300000,
          gasPrice: (await provider.getGasPrice()).mul(Math.ceil(this.config.relayer.gasMultiplier)),
        }
      );

      this.logger.info("Transaction sent", { txHash: tx.hash, destinationChain: destinationNetwork });
      return { success: true, txHash: tx.hash };
    } catch (err) {
      this.logger.error("Error relaying TokenDeposit", { error: err.message, event });
      return { success: false, error: err.message };
    }
  }

  /**
   * Relay TokenRedeem event -> Call withdraw() on destination
   */
  async relayTokenRedeem(event, destinationNetwork, destinationChainId) {
    try {
      this.logger.info("Relaying TokenRedeem event", {
        to: event.to,
        token: event.token,
        amount: event.amount,
        destinationChain: destinationNetwork,
      });

      const kappa = this.generateKappa(event.transactionHash);
      const provider = new ethers.providers.JsonRpcProvider(this.config.networks[destinationNetwork].rpcUrl);
      const crossHopAddress = this.config.networks[destinationNetwork].crossHopAddress;

      // Check if already processed
      const exists = await this.kappaExists(provider, crossHopAddress, kappa);
      if (exists) {
        this.logger.warn("Kappa already exists (replay prevention)", { kappa });
        return { success: false, reason: "Kappa already processed" };
      }

      // Calculate fee
      const fee = this.calculateFee(event.amount);

      // Prepare transaction
      const contract = new ethers.Contract(
        crossHopAddress,
        this.crossHopAbi,
        this.relayerWallet.connect(provider)
      );

      const tx = await contract.withdraw(
        event.to,
        event.token,
        event.amount,
        fee.toString(),
        kappa,
        {
          gasLimit: 300000,
          gasPrice: (await provider.getGasPrice()).mul(Math.ceil(this.config.relayer.gasMultiplier)),
        }
      );

      this.logger.info("Transaction sent", { txHash: tx.hash, destinationChain: destinationNetwork });
      return { success: true, txHash: tx.hash };
    } catch (err) {
      this.logger.error("Error relaying TokenRedeem", { error: err.message, event });
      return { success: false, error: err.message };
    }
  }

  /**
   * Relay TokenDepositAndSwap event -> Call mintAndSwap() on destination
   */
  async relayTokenDepositAndSwap(event, destinationNetwork) {
    try {
      this.logger.info("Relaying TokenDepositAndSwap event", {
        to: event.to,
        token: event.token,
        amount: event.amount,
        destinationChain: destinationNetwork,
      });

      const kappa = this.generateKappa(event.transactionHash);
      const provider = new ethers.providers.JsonRpcProvider(this.config.networks[destinationNetwork].rpcUrl);
      const crossHopAddress = this.config.networks[destinationNetwork].crossHopAddress;

      // Check if already processed
      const exists = await this.kappaExists(provider, crossHopAddress, kappa);
      if (exists) {
        this.logger.warn("Kappa already exists (replay prevention)", { kappa });
        return { success: false, reason: "Kappa already processed" };
      }

      // Calculate fee
      const fee = this.calculateFee(event.amount);

      // Prepare transaction
      const contract = new ethers.Contract(
        crossHopAddress,
        this.crossHopAbi,
        this.relayerWallet.connect(provider)
      );

      const tx = await contract.mintAndSwap(
        event.to,
        event.token,
        event.amount,
        fee.toString(),
        event.tokenIndexFrom,
        event.tokenIndexTo,
        event.minDy,
        event.deadline,
        kappa,
        {
          gasLimit: 500000,
          gasPrice: (await provider.getGasPrice()).mul(Math.ceil(this.config.relayer.gasMultiplier)),
        }
      );

      this.logger.info("Transaction sent", { txHash: tx.hash, destinationChain: destinationNetwork });
      return { success: true, txHash: tx.hash };
    } catch (err) {
      this.logger.error("Error relaying TokenDepositAndSwap", { error: err.message, event });
      return { success: false, error: err.message };
    }
  }

  /**
   * Relay TokenRedeemAndSwap event -> Call withdrawAndSwap() on destination
   */
  async relayTokenRedeemAndSwap(event, destinationNetwork) {
    try {
      this.logger.info("Relaying TokenRedeemAndSwap event", {
        to: event.to,
        token: event.token,
        amount: event.amount,
        destinationChain: destinationNetwork,
      });

      const kappa = this.generateKappa(event.transactionHash);
      const provider = new ethers.providers.JsonRpcProvider(this.config.networks[destinationNetwork].rpcUrl);
      const crossHopAddress = this.config.networks[destinationNetwork].crossHopAddress;

      // Check if already processed
      const exists = await this.kappaExists(provider, crossHopAddress, kappa);
      if (exists) {
        this.logger.warn("Kappa already exists (replay prevention)", { kappa });
        return { success: false, reason: "Kappa already processed" };
      }

      // Calculate fee
      const fee = this.calculateFee(event.amount);

      // Prepare transaction
      const contract = new ethers.Contract(
        crossHopAddress,
        this.crossHopAbi,
        this.relayerWallet.connect(provider)
      );

      const tx = await contract.withdrawAndSwap(
        event.to,
        event.token,
        event.amount,
        fee.toString(),
        event.tokenIndexFrom,
        event.tokenIndexTo,
        event.minDy,
        event.deadline,
        kappa,
        {
          gasLimit: 500000,
          gasPrice: (await provider.getGasPrice()).mul(Math.ceil(this.config.relayer.gasMultiplier)),
        }
      );

      this.logger.info("Transaction sent", { txHash: tx.hash, destinationChain: destinationNetwork });
      return { success: true, txHash: tx.hash };
    } catch (err) {
      this.logger.error("Error relaying TokenRedeemAndSwap", { error: err.message, event });
      return { success: false, error: err.message };
    }
  }
}

module.exports = RelayExecutor;
