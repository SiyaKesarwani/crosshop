const { ethers } = require("hardhat");
require("dotenv").config();

const deployedCrossHop = async (deployer) => {

    const CrossHop_ARTIFACT = await ethers.getContractFactory('CrossHop');

    const deployCrossHop = await CrossHop_ARTIFACT.connect(deployer).deploy();
    await deployCrossHop.deployed();
    await deployCrossHop.connect(deployer).initialize();

    console.log(`Waiting for blocks confirmations of the deploying CrossHop contract...`);
    console.log(`Confirmed!`);

    return {instance: deployCrossHop, address: deployCrossHop.address}; 
}

module.exports = {
    deployedCrossHop
};
