/**
 * Script to grant NODEGROUP_ROLE to relayer wallet on all deployed CrossHop contracts
 */

require("dotenv").config({ path: "./relayer/.env" });
const { ethers } = require("hardhat");
const fs = require("fs");

async function grantRelayerRole() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("Network Name:", network.name);
  console.log("Network ChainId:", network.chainId);
  console.log("Deployer:", deployer.address);

  // Determine network name from chainId if name is unknown
  let networkName = network.name;
  if (network.name === 'unknown') {
    const chainIdMap = {
      11155111: 'sepolia',
      421614: 'arbiSepolia',
      11155420: 'optiSepolia',
      80002: 'amoy',
      97: 'bnbTestnet',
      4002: 'fantomTestnet',
      31337: 'hardhat'
    };
    networkName = chainIdMap[network.chainId] || `chain_${network.chainId}`;
  }

  console.log("Using Network:", networkName);

  // Load deployment addresses
  const deploymentFile = `./deploy/deployments/${networkName}.json`;
  if (!fs.existsSync(deploymentFile)) {
    throw new Error(`Deployment file not found: ${deploymentFile}`);
  }

  const addresses = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const crossHopAddress = addresses.DEPLOYED_CROSSHOP_ADDRESS;

  console.log("CrossHop Address:", crossHopAddress);

  // Get CrossHop contract
  const CrossHop = await ethers.getContractFactory("CrossHop");
  const crossHop = CrossHop.attach(crossHopAddress);

  // Get relayer wallet from private key
  const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY;
  if (!relayerPrivateKey) {
    throw new Error("RELAYER_PRIVATE_KEY not found in .env file");
  }

  const relayerWallet = new ethers.Wallet(relayerPrivateKey);
  const relayerAddress = relayerWallet.address;

  console.log("Relayer Address:", relayerAddress);

  // Get NODEGROUP_ROLE
  const NODEGROUP_ROLE = await crossHop.NODEGROUP_ROLE();
  console.log("NODEGROUP_ROLE:", NODEGROUP_ROLE);

  // Check if already has role
  const hasRole = await crossHop.hasRole(NODEGROUP_ROLE, relayerAddress);
  if (hasRole) {
    console.log("✅ Relayer already has NODEGROUP_ROLE");
    return;
  }

  // Grant role
  console.log("Granting NODEGROUP_ROLE to relayer...");
  const tx = await crossHop.grantRole(NODEGROUP_ROLE, relayerAddress);
  await tx.wait();

  console.log("✅ NODEGROUP_ROLE granted successfully!");
  console.log("Transaction:", tx.hash);
}

grantRelayerRole()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
