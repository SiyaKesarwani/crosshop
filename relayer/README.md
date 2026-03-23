# CrossHop Relayer Service

The RelayerService is an off-chain component that listens for cross-chain bridge events and relays them to the destination chain. It's essential for completing cross-chain asset transfers in the CrossHop protocol.

## Overview

The relayer:
- ✅ Listens to `TokenDeposit`, `TokenRedeem`, `TokenDepositAndSwap`, and `TokenRedeemAndSwap` events on source chains
- ✅ Verifies events and generates replay-protection hashes (kappa)
- ✅ Relays transactions to destination chains with proper fee calculations
- ✅ Prevents replay attacks by checking kappa uniqueness
- ✅ Tracks processed transactions in a database
- ✅ Handles retries and gas price optimization
- ✅ Provides detailed logging for monitoring and debugging

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Relayer Service                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  EventListener (per network)                               │
│  ├─ Listens for TokenDeposit                               │
│  ├─ Listens for TokenRedeem                                │
│  ├─ Listens for TokenDepositAndSwap                        │
│  └─ Listens for TokenRedeemAndSwap                         │
│                        │                                    │
│                        ▼                                    │
│  EventQueue / Event Processor                              │
│  ├─ Deduplicates events using kappa                        │
│  ├─ Enqueues and processes events sequentially             │
│  └─ Handles event priority                                 │
│                        │                                    │
│                        ▼                                    │
│  RelayExecutor                                             │
│  ├─ Calculates fees                                        │
│  ├─ Prepares transactions                                  │
│  ├─ Sends mint/withdraw calls to destination               │
│  └─ Handles gas optimization                               │
│                        │                                    │
│                        ▼                                    │
│  ProcessedDatabase                                         │
│  ├─ Tracks processed transactions                          │
│  ├─ Stores relay transaction hashes                        │
│  └─ Prevents duplicate processing                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Setup

### Prerequisites

- Node.js v20.20.1 or higher
- npm (comes with Node.js)
- A funded wallet with NODEGROUP_ROLE on all CrossHop contracts

### Installation

1. **Install dependencies:**
   ```bash
   cd relayer
   npm install ethers dotenv
   ```

2. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env with your actual values
   # CRITICAL: Set RELAYER_PRIVATE_KEY to your node group account's private key
   nano .env
   ```

3. **Set CrossHop contract addresses:**
   Update the CrossHop contract addresses for each network in `.env`:
   ```
   SEPOLIA_CROSSHOP_ADDRESS=0x...
   ARBI_SEPOLIA_CROSSHOP_ADDRESS=0x...
   # etc.
   ```

## Running the Relayer

### Start the relayer service:

```bash
cd /Users/user/crosshop
node relayer/index.js
```

### Expected output:

```
[2026-03-21T10:30:45.123Z] [INFO] === Starting RelayerService ===
[2026-03-21T10:30:45.234Z] [INFO] Relayer wallet initialized  {"address":"0x..."}
[2026-03-21T10:30:45.345Z] [INFO] Event listener setup for sepolia {"chainId":11155111,...}
[2026-03-21T10:30:45.456Z] [INFO] Relayer service started and listening for events
```

### Monitoring:

Every 5 minutes, the relayer prints statistics:

```
=== Relayer Statistics ===
{
  "isRunning": true,
  "relayerAddress": "0x...",
  "eventQueueSize": 0,
  "processedTransactions": {
    "total": 42,
    "confirmed": 40,
    "failed": 2,
    "pending": 0
  }
}
===========================
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `RELAYER_PRIVATE_KEY` | - | **REQUIRED** Private key of node group account |
| `GAS_MULTIPLIER` | 1.2 | Gas price multiplier (1.0 = normal, 1.5 = 50% faster) |
| `MAX_RETRIES` | 3 | Max retry attempts for failed transactions |
| `RETRY_DELAY` | 5000 | Delay between retries (ms) |
| `POLL_INTERVAL` | 12000 | Event polling interval (ms) |
| `FEE_PERCENTAGE` | 10 | Fee in basis points (10 = 0.1%) |
| `LOG_LEVEL` | info | Logging level (error, warn, info, debug) |

## How It Works

### 1. Event Detection

The relayer listens to all configured networks for bridge events:

```
User Transaction on Chain A
    ↓
TokenDeposit event emitted
    ↓
Relayer detects event
```

### 2. Event Processing

```
Event received
    ↓
Generate kappa (replay-protection hash)
    ↓
Check if already processed
    ↓
Enqueue for relay
```

### 3. Transaction Relaying

```
Event queued
    ↓
Calculate relay fee (% of transfer amount)
    ↓
Call mint/withdraw on destination chain
    ↓
Track relay transaction
```

## Security Considerations

### 1. Private Key Protection

- ⚠️ **Never commit your `.env` file with private keys**
- ⚠️ **Use environment variables for sensitive data**
- ⚠️ **Consider using a key management service for production**

### 2. Replay Protection

The relayer prevents replay attacks using "kappa" (unique transaction identifiers):

```solidity
// In CrossHop.sol
mapping(bytes32 => bool) private kappaMap;

function mint(..., bytes32 kappa) external {
    require(!kappaMap[kappa], "Kappa is already present");
    kappaMap[kappa] = true;
    // Process transaction
}
```

The relayer generates kappa as:
```javascript
kappa = keccak256(abi.encodePacked(sourceTransactionHash))
```

### 3. Node Group Role

The relayer account must have the `NODEGROUP_ROLE` role on all CrossHop contracts:

```javascript
// Grant role via smart contract
await crossHop.grantRole(NODEGROUP_ROLE, relayerAddress);
```

## Fee Structure

The relayer collects a fee from each relay transaction:

```javascript
fee = amount * FEE_PERCENTAGE / 10000

// Example:
// If relaying 1000 tokens with FEE_PERCENTAGE=10 (0.1%)
// fee = 1000 * 10 / 10000 = 1 token
// user receives = 1000 - 1 = 999 tokens
```

Fees collected on destination chain can be withdrawn by governance.

## Troubleshooting

### Issue: "NODEGROUP_ROLE not set"

**Solution:** Grant the role to your relayer address:

```javascript
const crossHop = await ethers.getContractAt("CrossHop", crossHopAddress);
await crossHop.grantRole(crossHop.NODEGROUP_ROLE(), relayerAddress);
```

### Issue: "Kappa already exists"

**Reason:** Transaction was already processed (duplicate event)

**Solution:** Check the processed database:
```bash
cat relayer/data/processed.json | jq '.processed' | head -20
```

### Issue: "Chain ID mismatch"

**Reason:** RPC endpoint is not for the expected network

**Solution:** Verify RPC endpoints in `.env` match the correct networks

### Issue: "Gas price too low"

**Solution:** Increase `GAS_MULTIPLIER` in `.env`:
```
GAS_MULTIPLIER=2.0  # Higher = faster/more expensive
```

## Monitoring & Logging

### Log File Location

```
./relayer/logs/relayer.log
```

### View Recent Logs

```bash
tail -f relayer/logs/relayer.log
```

### View Processed Transactions

```bash
cat relayer/data/processed.json | jq '.processed' | head -50
```

## Production Deployment

### Recommended Setup

1. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start relayer/index.js --name "crosshop-relayer" --log-date-format "YYYY-MM-DD HH:mm:ss"
   pm2 save
   ```

2. **Setup log rotation:**
   ```bash
   npm install -g pm2-logrotate
   pm2 install pm2-logrotate
   ```

3. **Monitor with PM2:**
   ```bash
   pm2 monit
   ```

4. **Use a key management service:**
   - AWS KMS, HashiCorp Vault, or similar
   - Avoid storing private keys in plaintext

## API Reference

### RelayerService

```javascript
const relayer = new RelayerService();

// Initialize and start listening
await relayer.start();

// Get statistics
const stats = relayer.getStats();

// Stop the relayer
relayer.stop();
```

### Return Types

```javascript
// getStats() returns:
{
  isRunning: boolean,
  relayerAddress: string,
  eventQueueSize: number,
  processedTransactions: {
    total: number,
    confirmed: number,
    failed: number,
    pending: number
  }
}
```

## Contributing

To extend the relayer:

1. Add new event types in [listeners/eventListener.js](./listeners/eventListener.js)
2. Add corresponding relay methods in [executor/relayExecutor.js](./executor/relayExecutor.js)
3. Process new event types in [service/relayerService.js](./service/relayerService.js)

## License

MIT
