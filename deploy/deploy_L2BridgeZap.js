const { ethers } = require("hardhat");
require("dotenv").config();

const deployedL2BridgeZap = async (deployer, WETHAddress, StableSwapAddress, cUSDAddress, CrossHopAddress) => {

    const L2BridgeZap_ARTIFACT = await ethers.getContractFactory('L2BridgeZap');
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    const args = [
        WETHAddress,
        StableSwapAddress,
        cUSDAddress,
        ZERO_ADDRESS,
        ZERO_ADDRESS,
        CrossHopAddress
    ];

    const deployL2BridgeZap = await L2BridgeZap_ARTIFACT.connect(deployer).deploy(args[0],
        args[1], args[2], args[3], args[4], args[5]);
    await deployL2BridgeZap.deployed();

    console.log(`Waiting for blocks confirmations of the deploying L2BridgeZap contract...`);
    console.log(`Confirmed!`);

    return {instance: deployL2BridgeZap, address: deployL2BridgeZap.address, args: args}; 
}

module.exports = {
    deployedL2BridgeZap
};
