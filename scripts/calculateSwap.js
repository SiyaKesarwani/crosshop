const { 
	DEPLOYED_LPTOKEN_IMPL_ADDRESS,
    DEPLOYED_SWAP_UTILS_ADDRESS,
    DEPLOYED_AMPLIFICATION_UTILS_ADDRESS,
    DEPLOYED_SWAP_IMPL_ADDRESS,
    DEPLOYED_SWAP_DEPLOYER_ADDRESS,
    POOLED_TOKEN_ADDRESSES,
    DEPLOYED_STABLESWAPPOOL_ADDRESS
 } = require("../deploy/deployments/sepolia.json");
 const { ethers, network } = require("hardhat");
 const { utils } = require("ethers");

 async function main() {
    const [deployer] = await ethers.getSigners();
    const fromTokenIndex = ethers.BigNumber.from("0");
    const toTokenIndex = ethers.BigNumber.from("1");
    const amountDx = ethers.BigNumber.from("32032699629200000000");
    const stableSwapContract = await ethers.getContractAt('Swap', DEPLOYED_STABLESWAPPOOL_ADDRESS);
    console.log("Calculating Swap in progress...");
    const calculation = await stableSwapContract.connect(deployer).calculateSwap(
        fromTokenIndex,
        toTokenIndex,
        amountDx
    );
    console.log("Calculated amount of swapped tokens...", utils.formatEther(calculation));
 }

 main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });