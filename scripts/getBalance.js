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
    const yashAddress = "0x79A515316d4bf990f5ED9aF54A3e6359668281e5"
    const rohitAddress = "0x13e982ecaF764b3150e010f48682B767cf07D5f4"
    const tokenContract = await ethers.getContractAt('GenericERC20', POOLED_TOKEN_ADDRESSES[0]);
    console.log("Adding more tokens to deployer address");
    const transfer = await tokenContract.connect(deployer).mint(deployer.address, ethers.BigNumber.from("100000000000000000000000"));
    await transfer.wait();
    const send = await tokenContract.connect(deployer).transfer(rohitAddress,
                    ethers.BigNumber.from("100000000000000000000000"));
    await send.wait();
    console.log(utils.formatEther(await tokenContract.balanceOf(rohitAddress)));
    for(var i = 1; i < POOLED_TOKEN_ADDRESSES.length; i++){
        const tokenContract = await ethers.getContractAt('GenericERC20', POOLED_TOKEN_ADDRESSES[i]);
        console.log("Adding more tokens to deployer address");
        const transfer = await tokenContract.connect(deployer).mint(deployer.address, ethers.BigNumber.from("50000000000000000000"));
        await transfer.wait();
        const send = await tokenContract.connect(deployer).transfer(rohitAddress,
                        ethers.BigNumber.from("50000000000000000000"));
        await send.wait();
        console.log(utils.formatEther(await tokenContract.balanceOf(rohitAddress)));
    }

    // const ethStablePoolLP = "0x59235b248d1B7F117561F80F37fb6D67438Bc6b4";
    // const LPToken = await ethers.getContractAt('LPToken', ethStablePoolLP);
    // console.log("Balance of LP token in deployer's account...", 
    //                 utils.formatEther(await LPToken.balanceOf(deployer.address))
    //             );
 }

 main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });