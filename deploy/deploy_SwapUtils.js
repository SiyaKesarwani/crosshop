const { ethers } = require("hardhat");
require("dotenv").config();

const deployedSwapUtils = async (deployer) => {

    const SwapUtils_ARTIFACT = await ethers.getContractFactory('SwapUtils');

    const deploySwapUtils = await SwapUtils_ARTIFACT.connect(deployer).deploy();
    await deploySwapUtils.deployed();

    console.log(`Waiting for blocks confirmations of the deploying SwapUtils contract...`);
    console.log(`Confirmed!`);

    return {instance: deploySwapUtils, address: deploySwapUtils.address}; 
}

module.exports = {
    deployedSwapUtils
};
