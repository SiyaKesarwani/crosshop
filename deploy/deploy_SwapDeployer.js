const { ethers } = require("hardhat");
require("dotenv").config();

const deployedSwapDeployer = async (deployer) => {

    const SwapDeployer_ARTIFACT = await ethers.getContractFactory('SwapDeployer');

    const deploySwapDeployer = await SwapDeployer_ARTIFACT.connect(deployer).deploy();
    await deploySwapDeployer.deployed();

    console.log(`Waiting for blocks confirmations of the deploying SwapDeployer contract...`);
    console.log(`Confirmed!`);

    return {instance: deploySwapDeployer, address: deploySwapDeployer.address}; 
}

module.exports = {
    deployedSwapDeployer
};
