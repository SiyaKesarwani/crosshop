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
    const minDy = ethers.BigNumber.from("0");
    const deadLine = ethers.BigNumber.from("2000000000");
    const stableSwapContract = await ethers.getContractAt('Swap', DEPLOYED_STABLESWAPPOOL_ADDRESS);
    const fromTokenContract = await ethers.getContractAt('GenericERC20', POOLED_TOKEN_ADDRESSES[0]);
    /// Approve the amount of tokens first
    console.log("Approving from token...");
    const approveTokens = await fromTokenContract.connect(deployer).approve(stableSwapContract.address, 
                            amountDx
                        );
    await approveTokens.wait();
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(3000);
    console.log("Swapping in progress...");
    const swappedTokens = await stableSwapContract.connect(deployer).swap(
        fromTokenIndex,
        toTokenIndex,
        amountDx,
        minDy, 
        deadLine, 
        {gasLimit : 6000000}
    );
    console.log("Received amount of swapped tokens...", swappedTokens);
 }

 main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });