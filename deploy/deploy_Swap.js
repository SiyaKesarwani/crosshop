const { ethers } = require("hardhat");
require("dotenv").config();

const deployedSwap = async (deployer, deployedSwapUtilsContractAddress, deployedAmplificationUtilsContractAddress) => {

    const Swap_ARTIFACT = await ethers.getContractFactory('Swap', {
                                                            libraries:{
                                                                SwapUtils: deployedSwapUtilsContractAddress,
                                                                AmplificationUtils: deployedAmplificationUtilsContractAddress
                                                            }
                                                        });

    const deploySwap = await Swap_ARTIFACT.connect(deployer).deploy();
    await deploySwap.deployed();

    console.log(`Waiting for blocks confirmations of the deploying Swap contract...`);
    console.log(`Confirmed!`);

    return {instance: deploySwap, address: deploySwap.address}; 
}

module.exports = {
    deployedSwap
};
