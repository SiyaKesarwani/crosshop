## 🚀 Overview

CrossHop is a cross-chain asset transfer protocol that enables users to securely move assets between different blockchain networks using a lock-and-mint mechanism with off-chain relayer verification.

> ⚡ Designed with a focus on security, message integrity, and prevention of double-spend or replay attacks across chains.

## 🔄 Cross-Chain Flow

The protocol supports bidirectional asset transfers between chains using a lock-and-mint mechanism:

### Native Chain → Wrapped Chain (Deposit Flow)
1. User deposits native tokens on the source chain  
2. Tokens are locked in the source contract  
3. An event is emitted containing transfer details  
4. Off-chain relayer listens and forwards the message  
5. Destination contract verifies the message  
6. Wrapped tokens are minted on the destination chain  
7. Transaction is marked as processed to prevent replay

### Wrapped Chain → Native Chain (Redeem Flow)
1. User redeems wrapped tokens on the source chain  
2. Wrapped tokens are burned in the source contract  
3. An event is emitted containing transfer details  
4. Off-chain relayer listens and forwards the message  
5. Destination contract verifies the message  
6. Native tokens are unlocked on the destination chain  
7. Transaction is marked as processed to prevent replay  

## 🔐 Security Considerations

- Replay attack prevention using unique transaction identifiers  
- Double mint protection using processed message tracking  
- Signature verification for relayer messages  
- Access control for privileged operations  
- Safe handling of cross-chain message execution  

## ⚖️ Trust Assumptions

- Relayer is assumed to be trusted / semi-trusted  
- Destination chain relies on message authenticity from relayer  
- No decentralized validation (can be extended in future)  

## 🧠 Architecture
The protocol consists of:
- Source chain contracts (locking assets)
- Destination chain contracts (minting/unlocking assets)
- Off-chain relayer for message passing

## ⚠️ Edge Cases Handled

- Duplicate message execution prevented  
- Invalid signatures rejected  
- Transfers with insufficient funds reverted  
- Replay attacks prevented using unique identifiers  

## 🧪 Testing

- Unit tests written in Solidity using Foundry  
- Covers deposit, message verification, minting, and replay protection  

## 🌍 Why CrossHop?

Cross-chain interoperability is a key challenge in Web3. CrossHop demonstrates how assets can move securely between chains while maintaining correctness and preventing common bridge vulnerabilities.

## 🚀 Future Improvements

- Decentralized relayer network  
- Zero-knowledge proof based verification  
- Multi-signature validation for cross-chain messages  
- Support for multiple token standards (ERC20, NFTs)  

## ▶️ Run Locally

```shell
npm install
npx hardhat compile
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat run deploy/deploy.js
```
