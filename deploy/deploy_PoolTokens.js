const { ethers, network } = require("hardhat");
require("dotenv").config();

const USD_TOKENS_ARGS = {
    DAI: ["Dai Stablecoin", "DAI", "18"],
    USDC: ["USD Coin", "USDC", "6"],
    USDT: ["Tether USD", "USDT", "6"]
};

const deployedPoolTokens = async (deployer) => {

    const GenericToken_ARTIFACT = await ethers.getContractFactory('GenericERC20');
    var deployed_addresses = []
    var decimals = []

    for(token in USD_TOKENS_ARGS){
        const args = [USD_TOKENS_ARGS[token][0], USD_TOKENS_ARGS[token][1], USD_TOKENS_ARGS[token][2]];
        const deployGenericToken = await GenericToken_ARTIFACT.connect(deployer).deploy(
            args[0], args[1], args[2]
        );
        await deployGenericToken.deployed();
        deployed_addresses.push(deployGenericToken.address);
        decimals.push(USD_TOKENS_ARGS[token][2]);

        await deployGenericToken.connect(deployer).mint(deployer.address, 10e6);
    }

    console.log(`Waiting for blocks confirmations of the deploying tokens contract...`);
    console.log(`Confirmed!`);

    return {addresses: deployed_addresses, decimals: decimals}; 
}

module.exports = {
    deployedPoolTokens
};
