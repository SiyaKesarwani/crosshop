const { 
   chainConfig
} = require("../utils/constants");

const {
    swapAbi,
    erc20Abi,
    tokenAbi,
    zapAbi,
    L2zapAbi
} = require("../abis/index.js");

const {ethers} = require('ethers');

function getNetworkConstants(networkChainId){
   return chainConfig[networkChainId];
}

const getBalanceOfTokens = async (
    networkChainId,
    ownerAddress
) => {
    const constants = getNetworkConstants(networkChainId);
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);
    const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY_1, alchemyProvider);
    let balance = [];
    const LPContract = new ethers.Contract(constants.LPT_DETAILS.address, tokenAbi, signer);
    balance.push(ethers.utils.formatUnits(await LPContract.balanceOf(ownerAddress)));
    const DaiContract = new ethers.Contract(constants.tokenDetails[0].address, erc20Abi, signer);
    balance.push(ethers.utils.formatUnits(await DaiContract.balanceOf(ownerAddress)));
    const UsdcContract = new ethers.Contract(constants.tokenDetails[1].address, erc20Abi, signer);
    balance.push(ethers.utils.formatUnits(await UsdcContract.balanceOf(ownerAddress)));
    const UsdtContract = new ethers.Contract(constants.tokenDetails[2].address, erc20Abi, signer);
    balance.push(ethers.utils.formatUnits(await UsdtContract.balanceOf(ownerAddress)));
    if(networkChainId != "11155111"){
        const cUSDContract = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, signer);
        balance.push(ethers.utils.formatUnits(await cUSDContract.balanceOf(ownerAddress)));
    }
    return balance;
}

const checkAllowanceFE = async (
    networkChainId,
    ownerAddress,
    tokenIndex
) => {
    const constants = getNetworkConstants(networkChainId);
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);
    const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY_1, alchemyProvider);
    const stableSwapContract = new ethers.Contract(constants.STABLESWAPPOOL_ADDRESS, swapAbi, signer);
    let allowance;
    switch(tokenIndex){
        case 0:
            const DaiContract = new ethers.Contract(constants.tokenDetails[0].address, erc20Abi, signer);
            allowance = await DaiContract.allowance(ownerAddress, stableSwapContract.address);
            break;
        case 1:
            const UsdcContract = new ethers.Contract(constants.tokenDetails[1].address, erc20Abi, signer);
            allowance = await UsdcContract.allowance(ownerAddress, stableSwapContract.address);
            break;
        case 2:
            const UsdtContract = new ethers.Contract(constants.tokenDetails[2].address, erc20Abi, signer);
            allowance = await UsdtContract.allowance(ownerAddress, stableSwapContract.address);
            break;
        case 3:
            const cUSDContract = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, signer);
            allowance = await cUSDContract.allowance(ownerAddress, stableSwapContract.address);
            break;
    }
    return allowance;
}

const checkAllowanceZapFE = async (
    networkChainId,
    ownerAddress,
    tokenIndex
) => {
    const constants = getNetworkConstants(networkChainId);
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);
    const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY_1, alchemyProvider);
    const zapContract = new ethers.Contract(constants.L1BRIDGEZAP_ADDRESS, zapAbi, signer);
    let allowance;
    switch(tokenIndex){
        case 0:
            const DaiContract = new ethers.Contract(constants.tokenDetails[0].address, erc20Abi, signer);
            allowance = await DaiContract.allowance(ownerAddress, zapContract.address);
            break;
        case 1:
            const UsdcContract = new ethers.Contract(constants.tokenDetails[1].address, erc20Abi, signer);
            allowance = await UsdcContract.allowance(ownerAddress, zapContract.address);
            break;
        case 2:
            const UsdtContract = new ethers.Contract(constants.tokenDetails[2].address, erc20Abi, signer);
            allowance = await UsdtContract.allowance(ownerAddress, zapContract.address);
            break;
        case 3:
            const cUSDContract = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, signer);
            allowance = await cUSDContract.allowance(ownerAddress, zapContract.address);
            break;
    }
    return allowance;
}

const calculateMinDyForSwap = async (
   networkChainId,
   fromTokenIndex,
   toTokenIndex,
   amountDx
) => {
   const constants = getNetworkConstants(networkChainId);
   const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);
   const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY_1, alchemyProvider);
   const stableSwapContract = new ethers.Contract(constants.STABLESWAPPOOL_ADDRESS, swapAbi, signer);
   console.log("Calculating minDy for Swap in progress...");
   const calculation = await stableSwapContract.calculateSwap(
      fromTokenIndex,
      toTokenIndex,
      amountDx
   );
   console.log("MinDy for swapping...", ethers.utils.formatUnits(calculation));
   return(calculation);
}

const calculateMinToMintForAddLiquidity = async (
   networkChainId,
   amounts,
   deposit
) => {
   const constants = getNetworkConstants(networkChainId);
   const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);
   const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY_1, alchemyProvider);
   const stableSwapContract = new ethers.Contract(constants.STABLESWAPPOOL_ADDRESS, swapAbi, signer);
   console.log("Calculating minToMint for AddLiquidity in progress...");
   const calculation = await stableSwapContract.calculateTokenAmount(
   amounts,
   deposit
   );

   const calculatedWithSlippage = calculation.mul(999).div(1000);
   console.log("MinToMint for adding this liquidity...", ethers.utils.formatUnits(calculatedWithSlippage));
   return(calculatedWithSlippage);
}

const calculateMinToMintInZap = async (
   networkChainId,
   amounts,
   deposit
) => {
   const constants = getNetworkConstants(networkChainId);
   const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);
   const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY_1, alchemyProvider);
   const zapContract = new ethers.Contract(constants.L1BRIDGEZAP_ADDRESS, zapAbi, signer);
   console.log("Calculating minToMint for AddLiquidityZap in progress...");
   const calculation = await zapContract.calculateTokenAmount(
   amounts,
   deposit
   );

   const calculatedWithSlippage = calculation.mul(999).div(1000);
   console.log("MinToMint for adding this liquidity...", ethers.utils.formatUnits(calculatedWithSlippage));
   return(calculatedWithSlippage);
}

const calculateMinDyInZap = async (
   networkChainId,
   fromTokenIndex,
   toTokenIndex,
   amountDx
) => {
   const constants = getNetworkConstants(networkChainId);
   const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);
   const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY_1, alchemyProvider);
   const L2zapContract = new ethers.Contract(constants.L2BRIDGEZAP_ADDRESS, L2zapAbi, signer);
   const cUSDContract = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, signer);
   console.log("Calculating minDy for Swap in progress...");
   const calculation = await L2zapContract.calculateSwap(
        cUSDContract.address,
      fromTokenIndex,
      toTokenIndex,
      amountDx
   );
   console.log("MinDy for swapping...", ethers.utils.formatUnits(calculation));
   return(calculation);
}

const calculateMinAmountsForRemoveLiquidity = async (
   networkChainId,
   amount
) => {
   const constants = getNetworkConstants(networkChainId);
   const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);
   const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY_1, alchemyProvider);
   const stableSwapContract = new ethers.Contract(constants.STABLESWAPPOOL_ADDRESS, swapAbi, signer);
   console.log("Calculating minAmounts for RemoveLiquidity in progress...");
   let calculation = await stableSwapContract.calculateRemoveLiquidity(
   amount
   );
   let calculatedMinAmountsToReceive = []

   for(i=0;i<calculation.length;i++){
   calculatedMinAmountsToReceive[i] = ethers.utils.formatUnits(calculation[i])
   }
   console.log("MinAmount to be received for removing this liquidity...", calculatedMinAmountsToReceive);
   return(calculation);
}

const calculateMinAmountToReceiveInOneToken = async (
   networkChainId,
   amount,
   tokenIndex
) => {
   const constants = getNetworkConstants(networkChainId);
   const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);
   const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY_1, alchemyProvider);
   const stableSwapContract = new ethers.Contract(constants.STABLESWAPPOOL_ADDRESS, swapAbi, signer);
   console.log("Calculating minAmount to withdraw one token for removing liquidity in progress...");
   const calculation = await stableSwapContract.calculateRemoveLiquidityOneToken(
    amount,
    tokenIndex
   );
   console.log("minAmount to withdraw one token ...", ethers.utils.formatUnits(calculation));
   return(calculation);
}

module.exports = {
   calculateMinDyForSwap,
   calculateMinToMintForAddLiquidity,
   calculateMinAmountsForRemoveLiquidity,
   checkAllowanceFE,
   checkAllowanceZapFE,
   calculateMinToMintInZap,
   getBalanceOfTokens,
   calculateMinDyInZap,
   calculateMinAmountToReceiveInOneToken,
   getNetworkConstants
};
