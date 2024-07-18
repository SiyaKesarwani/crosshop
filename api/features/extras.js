const { 
    chainConfig
 } = require("../utils/constants");

const {
    tokenAbi,
    bridgeAbi
} = require("../abis/index.js");

const {ethers} = require('ethers');

function getNetworkConstants(networkChainId){
   return chainConfig[networkChainId];
}

const transferOwnershipToBridge = async (
    networkChainId,
    caller,
    toAddress
) => {
    const constants = getNetworkConstants(networkChainId);
    if(networkChainId == "11155111"){
        const cUSD = new ethers.Contract(constants.LPT_DETAILS.address, tokenAbi, caller);
        const tx = await cUSD.connect(caller).transferOwnership(toAddress, {gasLimit : 6000000});
        await tx.wait();
    }
    const cUSD = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, caller);
    const tx = await cUSD.connect(caller).transferOwnership(toAddress, {gasLimit : 6000000});
    await tx.wait();
}
 
const grantRoleToBridge = async (
   networkChainId,
   caller,
   role,
   accountAddress
) => {
   const constants = getNetworkConstants(networkChainId);
   const bridgeContract = new ethers.Contract(constants.CROSSHOP_ADDRESS, bridgeAbi, caller);
   await bridgeContract.grantRole(role, accountAddress, {gasLimit : 6000000});
   console.log("Role granted...")
}

const getOwnerOfLPToken = async (
    networkChainId
) => {
    const constants = getNetworkConstants(networkChainId);
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);
    const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY_1, alchemyProvider);
    if(networkChainId == "11155111"){
        const cUSD = new ethers.Contract(constants.LPT_DETAILS.address, tokenAbi, signer);
        const tx = await cUSD.owner();
        return tx;
    }
    const cUSD = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, signer);
    const tx = await cUSD.owner();
    return tx;
}

module.exports = {
    transferOwnershipToBridge,
    getOwnerOfLPToken,
    grantRoleToBridge
};
