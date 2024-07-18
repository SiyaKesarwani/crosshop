const { ethers } = require("hardhat");
require("dotenv").config();

const deployedLPToken = async (deployer) => {

    const LPToken_ARTIFACT = await ethers.getContractFactory('LPToken');

    const deployLPToken = await LPToken_ARTIFACT.connect(deployer).deploy();
    await deployLPToken.deployed();

    console.log(`Waiting for blocks confirmations of the deploying LPToken contract...`);
    console.log(`Confirmed!`);

    return {instance: deployLPToken, address: deployLPToken.address}; 
}

module.exports = {
    deployedLPToken
};
