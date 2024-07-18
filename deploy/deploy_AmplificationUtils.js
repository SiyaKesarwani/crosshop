const { ethers } = require("hardhat");
require("dotenv").config();

const deployedAmplificationUtils = async (deployer) => {

    const AmplificationUtils_ARTIFACT = await ethers.getContractFactory('AmplificationUtils');

    const deployAmplificationUtils = await AmplificationUtils_ARTIFACT.connect(deployer).deploy();
    await deployAmplificationUtils.deployed();

    console.log(`Waiting for blocks confirmations of the deploying AmplificationUtils contract...`);
    console.log(`Confirmed!`);

    return {instance: deployAmplificationUtils, address: deployAmplificationUtils.address}; 
}

module.exports = {
    deployedAmplificationUtils
};
