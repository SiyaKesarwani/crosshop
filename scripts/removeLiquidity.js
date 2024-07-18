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
    const minToken0Amount = ethers.BigNumber.from("0");
    const minToken1Amount = ethers.BigNumber.from("0");
    const minToken2Amount = ethers.BigNumber.from("0");
    const amount = ethers.BigNumber.from("1000042609962359826");
    const deadLine = ethers.BigNumber.from("2000000000");
    const stableSwapContract = await ethers.getContractAt('Swap', DEPLOYED_STABLESWAPPOOL_ADDRESS);
    const ethStablePoolLP = "0x59235b248d1B7F117561F80F37fb6D67438Bc6b4";
    const LPToken = await ethers.getContractAt('LPToken', ethStablePoolLP);
    /// Approve the amount of tokens first
    console.log("Approving Swap contract to burn LP tokens...");
    const approveTokens = await LPToken.connect(deployer).approve(stableSwapContract.address, 
                            amount
                        );
    await approveTokens.wait();
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(3000);
    console.log("Removing liquidity...");
    const burntLPTokens = await stableSwapContract.connect(deployer).removeLiquidity(
        amount,
        [
            minToken0Amount,
            minToken1Amount,
            minToken2Amount
        ], 
        deadLine, 
        {gasLimit : 6000000}
    );
    console.log("Burned amount of LP tokens...", burntLPTokens);
 }

 main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });