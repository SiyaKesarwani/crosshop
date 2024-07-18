const {Signer } = require("ethers");

async function asyncForEach(array, callback){
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index);
    }
  }
  
  async function getUserTokenBalances(address, tokens){
    let balanceArray = [];
  
    if (address instanceof Signer) {
      address = await address.getAddress();
    }
    for (const token of tokens) {
      balanceArray.push(await token.balanceOf(address));
    }
    return balanceArray;
  }
  
  async function getUserTokenBalance(address, token){
    if (address instanceof Signer) {
      address = await address.getAddress();
    }
    return token.balanceOf(address);
  }

  async function getPoolBalances(swap, numOfTokens){
    const balances = [];
  
    for (let i = 0; i < numOfTokens; i++) {
      balances.push(await swap.getTokenBalance(i));
    }
    return balances;
  }
  
  async function forceAdvanceOneBlock(timestamp){
    const params = timestamp ? [timestamp] : [];
    return ethers.provider.send("evm_mine", params);
  }
  
  async function setTimestamp(timestamp){
    return forceAdvanceOneBlock(timestamp);
  }
  
  async function getCurrentBlockTimestamp(){
    const block = await ethers.provider.getBlock("latest");
    return(block.timestamp);
  }
  
  async function setNextTimestamp(timestamp){
    const chainId = (await ethers.provider.getNetwork()).chainId;
  
    switch (chainId) {
      case 31337: // buidler evm
        return ethers.provider.send("evm_setNextBlockTimestamp", [timestamp]);
      case 1337: // ganache
      default:
        return setTimestamp(timestamp);
    }
  }
  
  const MAX_UINT256 = ethers.constants.MaxUint256;
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const TIME = {
    SECONDS : 1,
    DAYS : 86400,
    WEEKS : 604800,
  }

  module.exports = {
    asyncForEach,
    getUserTokenBalance,
    getUserTokenBalances,
    getPoolBalances,
    forceAdvanceOneBlock,
    setTimestamp,
    getCurrentBlockTimestamp,
    setNextTimestamp,
    MAX_UINT256,
    ZERO_ADDRESS,
    TIME
  }