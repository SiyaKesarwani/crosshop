const { 
	DEPLOYED_LPTOKEN_IMPL_ADDRESS,
    DEPLOYED_SWAP_UTILS_ADDRESS,
    DEPLOYED_AMPLIFICATION_UTILS_ADDRESS,
    DEPLOYED_SWAP_IMPL_ADDRESS,
    DEPLOYED_SWAP_DEPLOYER_ADDRESS,
    POOLED_TOKEN_ADDRESSES,
    DEPLOYED_STABLESWAPPOOL_ADDRESS
 } = require("../deploy/deployments/optiSepolia.json");
 const { ethers, network } = require("hardhat");
 const { utils } = require("ethers");

 async function main() {
    const [deployer] = await ethers.getSigners();
    const token0Amount = ethers.BigNumber.from("73306548170601083813");
    const token1Amount = ethers.BigNumber.from("1498001907");
    const token2Amount = ethers.BigNumber.from("91461889");
    const minToMint = ethers.BigNumber.from("0");
    const deadLine = ethers.BigNumber.from("2000000000");
    const stableSwapContract = await ethers.getContractAt('Swap', DEPLOYED_STABLESWAPPOOL_ADDRESS);
    const tokenContract0 = await ethers.getContractAt('GenericERC20', POOLED_TOKEN_ADDRESSES[0]);
    const tokenContract1 = await ethers.getContractAt('GenericERC20', POOLED_TOKEN_ADDRESSES[1]);
    const tokenContract2 = await ethers.getContractAt('GenericERC20', POOLED_TOKEN_ADDRESSES[2]);
    /// Approve the amount of tokens first
    console.log("Approving first token...");
    const approveTokens = await tokenContract0.connect(deployer).approve(stableSwapContract.address, 
                                token0Amount
                        );
    await approveTokens.wait();
    console.log("Approving second token...");
    const approveTokens1 = await tokenContract1.connect(deployer).approve(stableSwapContract.address, 
                                    token1Amount
                        );
    await approveTokens1.wait();
    console.log("Approving third token...");
    const approveTokens2 = await tokenContract2.connect(deployer).approve(stableSwapContract.address, 
                                    token2Amount
                        );
    await approveTokens2.wait();
    if(network.config.chainId != 11155111){
        const tokenContract3 = await ethers.getContractAt('LPToken', POOLED_TOKEN_ADDRESSES[3]);
        console.log("Approving fourth token...");
        const approveTokens = await tokenContract3.connect(deployer).approve(stableSwapContract.address, 
                                        token0Amount
                            );
        await approveTokens.wait();
    }
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(3000);
    console.log("Adding liquidity...");
    const mintedLPTokens = await stableSwapContract.connect(deployer).addLiquidity(
        [
            token0Amount,
            token1Amount,
            token2Amount,
            token0Amount
        ], 
        minToMint, 
        deadLine, 
        {gasLimit : 6000000}
    );
    console.log("Minted amount of LP tokens...", mintedLPTokens);
 }

 main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });