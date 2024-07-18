const { ethers } = require("hardhat");
require("dotenv").config();

const deployedL1BridgeZap = async (deployer, WETHAddress, StableSwapAddress, CrossHopAddress) => {

    const L1BridgeZap_ARTIFACT = await ethers.getContractFactory('L1BridgeZap');
    const args = [
        WETHAddress,
        StableSwapAddress,
        CrossHopAddress
    ];

    const deployL1BridgeZap = await L1BridgeZap_ARTIFACT.connect(deployer).deploy(args[0],
        args[1], args[2]);
    await deployL1BridgeZap.deployed();

    console.log(`Waiting for blocks confirmations of the deploying L1BridgeZap contract...`);
    console.log(`Confirmed!`);

    return {instance: deployL1BridgeZap, address: deployL1BridgeZap.address, args: args}; 
}

module.exports = {
    deployedL1BridgeZap
};
