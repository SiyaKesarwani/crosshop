const { 
    chainConfig
 } = require("../utils/constants");

 const { 
    calculateMinDyForSwap,
    calculateMinToMintForAddLiquidity,
    calculateMinAmountsForRemoveLiquidity,
    calculateMinToMintInZap
  } = require("./poolGetters");

const {
    swapAbi,
    erc20Abi,
    tokenAbi,
	bridgeAbi,
	zapAbi,
    L2zapAbi
} = require("../abis/index.js");

const {ethers} = require('ethers');

function getNetworkConstants(networkChainId){
   return chainConfig[networkChainId];
}

const checkAllowance = async (
   ownerAddress,
   zapAddress,
   token
) => {
   const tokenAllowance = await token.allowance(ownerAddress, zapAddress);
   return tokenAllowance;
}
 
const approvalAddLiquidityToZap = async (
   networkChainId,
   caller,
   amounts
 ) => {
   const constants = getNetworkConstants(networkChainId);
   const zapContract = new ethers.Contract(constants.L1BRIDGEZAP_ADDRESS, zapAbi, caller);
   if(networkChainId != "11155111"){
       if(amounts[3] > BigInt(Number(0))){
           const cUSDContract = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, caller);
           const allowance = await checkAllowance(caller.address, zapContract.address, cUSDContract);
           console.log(allowance);
           if(allowance < amounts[3]){
               console.log("Approving cUSD token...");
               const approveTokens = await cUSDContract.connect(caller).approve(
                 zapContract.address,
                 amounts[3], {gasLimit : 6000000}
               );
               await approveTokens.wait();
           }
       }
   }
   if (amounts[0] > BigInt(Number(0))) {
       const DaiContract = new ethers.Contract(constants.tokenDetails[0].address, erc20Abi, caller);
       const allowance = await checkAllowance(caller.address, zapContract.address, DaiContract);
       console.log(allowance);
       if(allowance < amounts[0]){
           console.log("Approving DAI token...");
           const approveTokens = await DaiContract.connect(caller).approve(
             zapContract.address,
             amounts[0], {gasLimit : 6000000}
           );
           await approveTokens.wait();
       }
   }
   if (amounts[1] > BigInt(Number(0))) {
       const UsdcContract = new ethers.Contract(constants.tokenDetails[1].address, erc20Abi, caller);
       const allowance = await checkAllowance(caller.address, zapContract.address, UsdcContract);
       console.log(allowance);
       if(allowance < amounts[1]){
           console.log("Approving USDC token...");
           const approveTokens = await UsdcContract.connect(caller).approve(
             zapContract.address,
             amounts[1], {gasLimit : 6000000}
           );
           await approveTokens.wait();
       }
   }
   if (amounts[2] > BigInt(Number(0))) {
       const UsdtContract = new ethers.Contract(constants.tokenDetails[2].address, erc20Abi, caller);
       const allowance = await checkAllowance(caller.address, zapContract.address, UsdtContract);
       console.log(allowance);
       if(allowance < amounts[2]){
           console.log("Approving USDT token...");
           const approveTokens = await UsdtContract.connect(caller).approve(
             zapContract.address,
             amounts[2], {gasLimit : 6000000}
           );
           await approveTokens.wait();
       }
   }
}

 const stableToStableFromL1ToL2 = async (
    networkChainId,
    caller,
    destChainId,
    originLiqAmountsToAdd,
    originMinToMintWithSlippage,
    destSwapTokenIndexFrom,
    destSwapTokenIndexTo,
    destMinDy
 ) => {
    const constants = getNetworkConstants(networkChainId);
    const zapContract = new ethers.Contract(constants.L1BRIDGEZAP_ADDRESS, zapAbi, caller);
    const toAddress = caller.address;
    const originLPToken = new ethers.Contract(constants.LPT_DETAILS.address, tokenAbi, caller);
    const originLiqDeadline = new Date().getTime() + 120;
    const destSwapDeadline = new Date().getTime() + 30000;

    const tx = await zapContract.functions.zapAndDepositAndSwap(
        toAddress,
        destChainId,
        originLPToken.address,
        originLiqAmountsToAdd,
        originMinToMintWithSlippage,
        originLiqDeadline,
        destSwapTokenIndexFrom,
        destSwapTokenIndexTo,
        destMinDy,
        destSwapDeadline, {gasLimit : 6000000}
    )

    var txReceipt = await(await tx.wait());
	const txHash = await txReceipt.transactionHash;
	const iface = new ethers.utils.Interface(bridgeAbi);
	const topic = iface.getEventTopic("TokenDepositAndSwap");
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);

	const amountToBeMintedAndSwapped = fetchDetailsFromEvent(alchemyProvider, txHash, iface, topic);
	return amountToBeMintedAndSwapped;
 }

 const stableTocUSDFromL1ToL2 = async (
    networkChainId,
    caller,
    destChainId,
    originLiqAmountsToAdd,
    originMinToMintWithSlippage
 ) => {
    const constants = getNetworkConstants(networkChainId);
    const zapContract = new ethers.Contract(constants.L1BRIDGEZAP_ADDRESS, zapAbi, caller);
    const toAddress = caller.address;
    const originLPToken = new ethers.Contract(constants.LPT_DETAILS.address, tokenAbi, caller);
    const originLiqDeadline = new Date().getTime() + 120;

    const tx = await zapContract.functions.zapAndDeposit(
        toAddress,
        destChainId,
        originLPToken.address,
        originLiqAmountsToAdd,
        originMinToMintWithSlippage,
        originLiqDeadline, {gasLimit : 6000000}
    )

    var txReceipt = await(await tx.wait());
	const txHash = await txReceipt.transactionHash;
	const iface = new ethers.utils.Interface(bridgeAbi);
	const topic = iface.getEventTopic("TokenDeposit");
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);

	const amountToBeMinted = fetchDetailsFromEvent(alchemyProvider, txHash, iface, topic);
	return amountToBeMinted;
 }
 
 const approvalAddTokenToZap = async (
    networkChainId,
    caller,
    amount,
    tokenIndex = 3 // DEFAULT TO 3
  ) => {
    const constants = getNetworkConstants(networkChainId);
    let zapContract;
    if(networkChainId == "11155111"){
        zapContract = new ethers.Contract(constants.L1BRIDGEZAP_ADDRESS, zapAbi, caller);
        const cUSDContract = new ethers.Contract(constants.LPT_DETAILS.address, tokenAbi, caller);
        allowance = await checkAllowance(caller.address, zapContract.address, cUSDContract);
        console.log(allowance);
        if(allowance < amount){
            console.log("Approving cUSD token...");
            const approveTokens = await cUSDContract.connect(caller).approve(
                zapContract.address,
                amount, {gasLimit : 6000000}
            );
            await approveTokens.wait();
        }
        return allowance;
    }
    else{
        zapContract = new ethers.Contract(constants.L2BRIDGEZAP_ADDRESS, L2zapAbi, caller);
        let allowance;
        switch(tokenIndex){
            case 0:
                const DaiContract = new ethers.Contract(constants.tokenDetails[0].address, erc20Abi, caller);
                allowance = await checkAllowance(caller.address, zapContract.address, DaiContract);
                console.log(allowance);
                if(allowance < amount){
                    console.log("Approving DAI token...");
                    const approveTokens = await DaiContract.connect(caller).approve(
                        zapContract.address,
                        amount, {gasLimit : 6000000}
                    );
                    await approveTokens.wait();
                }
                break;
            case 1:
                const UsdcContract = new ethers.Contract(constants.tokenDetails[1].address, erc20Abi, caller);
                allowance = await checkAllowance(caller.address, zapContract.address, UsdcContract);
                console.log(allowance);
                if(allowance < amount){
                    console.log("Approving USDC token...");
                    const approveTokens = await UsdcContract.connect(caller).approve(
                        zapContract.address,
                        amount, {gasLimit : 6000000}
                    );
                    await approveTokens.wait();
                }
                break;
            case 2:
                const UsdtContract = new ethers.Contract(constants.tokenDetails[2].address, erc20Abi, caller);
                allowance = await checkAllowance(caller.address, zapContract.address, UsdtContract);
                console.log(allowance);
                if(allowance < amount){
                    console.log("Approving USDT token...");
                    const approveTokens = await UsdtContract.connect(caller).approve(
                        zapContract.address,
                        amount, {gasLimit : 6000000}
                    );
                    await approveTokens.wait();
                }
                break;
            case 3:
                const cUSDContract = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, caller);
                allowance = await checkAllowance(caller.address, zapContract.address, cUSDContract);
                console.log(allowance);
                if(allowance < amount){
                    console.log("Approving cUSD token...");
                    const approveTokens = await cUSDContract.connect(caller).approve(
                        zapContract.address,
                        amount, {gasLimit : 6000000}
                    );
                    await approveTokens.wait();
                }
                break;
        }
        return allowance;
    }
 }

 const stableToStableFromL2ToL1 = async (
    networkChainId,
    caller,
    destChainId,
    originSwapTokenIndexFrom,
    originSwapTokenIndexTo,
    originDx,
    originMinDy,
    destTokenIndex,
    destMinWithdrawAmount,
 ) => {
    const constants = getNetworkConstants(networkChainId);
    const L2zapContract = new ethers.Contract(constants.L2BRIDGEZAP_ADDRESS, L2zapAbi, caller);
    const toAddress = caller.address;
    const origincUSD = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, caller);
    const originSwapDeadline = new Date().getTime() + 120;
    const destWithdrawDeadline = new Date().getTime() + 30000;

    const tx = await L2zapContract.functions.swapAndRedeemAndRemove(
        toAddress,
        destChainId,
        origincUSD.address,
        originSwapTokenIndexFrom,
        originSwapTokenIndexTo,
        originDx,
        originMinDy,
        originSwapDeadline,
        destTokenIndex,
        destMinWithdrawAmount,
        destWithdrawDeadline, {gasLimit : 6000000}
    )

    var txReceipt = await(await tx.wait());
	const txHash = await txReceipt.transactionHash;
	const iface = new ethers.utils.Interface(bridgeAbi);
	const topic = iface.getEventTopic("TokenRedeemAndRemove");
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);

	const amountToBeSwapped = fetchDetailsFromEvent(alchemyProvider, txHash, iface, topic);
	return amountToBeSwapped;
 }

 const stableTocUSDFromL2ToL1 = async (
    networkChainId,
    caller,
    destChainId,
    originSwapTokenIndexFrom,
    originSwapTokenIndexTo,
    originDx,
    originMinDy
 ) => {
    const constants = getNetworkConstants(networkChainId);
    const L2zapContract = new ethers.Contract(constants.L2BRIDGEZAP_ADDRESS, L2zapAbi, caller);
    const toAddress = caller.address;
    const origincUSD = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, caller);
    const originSwapDeadline = new Date().getTime() + 120;

    const tx = await L2zapContract.functions.swapAndRedeem(
        toAddress,
        destChainId,
        origincUSD.address,
        originSwapTokenIndexFrom,
        originSwapTokenIndexTo,
        originDx,
        originMinDy,
        originSwapDeadline, {gasLimit : 6000000}
    )

    var txReceipt = await(await tx.wait());
	const txHash = await txReceipt.transactionHash;
	const iface = new ethers.utils.Interface(bridgeAbi);
	const topic = iface.getEventTopic("TokenRedeem");
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);

	const amountToBeSwapped = fetchDetailsFromEvent(alchemyProvider, txHash, iface, topic);
	return amountToBeSwapped;
 }

 const cUSDToStableFromL1ToL2 = async (
    networkChainId,
    caller,
    destChainId,
    tokenAmount,
    destSwapTokenIndexFrom,
    destSwapTokenIndexTo,
    destMinDy
 ) => {
    const constants = getNetworkConstants(networkChainId);
    const L1zapContract = new ethers.Contract(constants.L1BRIDGEZAP_ADDRESS, zapAbi, caller);
    const toAddress = caller.address;
    let origincUSD;
    if(networkChainId == "11155111"){
        origincUSD = new ethers.Contract(constants.LPT_DETAILS.address, tokenAbi, caller);
    }
    else{
        origincUSD = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, caller);
    }
    const destSwapDeadline = new Date().getTime() + 30000;

    const tx = await L1zapContract.depositAndSwap(
        toAddress,
        destChainId,
        origincUSD.address,
        tokenAmount,
        destSwapTokenIndexFrom,
        destSwapTokenIndexTo,
        destMinDy,
        destSwapDeadline, {gasLimit : 6000000}
    )

    var txReceipt = await(await tx.wait());
	const txHash = await txReceipt.transactionHash;
	const iface = new ethers.utils.Interface(bridgeAbi);
	const topic = iface.getEventTopic("TokenDepositAndSwap");
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);

	const amountToBeSwapped = fetchDetailsFromEvent(alchemyProvider, txHash, iface, topic);
	return amountToBeSwapped;
 }

 const cUSDToStableFromL2ToL1 = async (
    networkChainId,
    caller,
    destChainId,
    tokenAmount,
    destTokenIndex,
    destMinWithdrawAmount
 ) => {
    const constants = getNetworkConstants(networkChainId);
    const L2zapContract = new ethers.Contract(constants.L2BRIDGEZAP_ADDRESS, L2zapAbi, caller);
    const toAddress = caller.address;
    const origincUSD = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, caller);
    const destWithdrawDeadline = new Date().getTime() + 30000;

    const tx = await L2zapContract.redeemAndRemove(
        toAddress,
        destChainId,
        origincUSD.address,
        tokenAmount,
        destTokenIndex,
        destMinWithdrawAmount,
        destWithdrawDeadline, {gasLimit : 6000000}
    )

    var txReceipt = await(await tx.wait());
	const txHash = await txReceipt.transactionHash;
	const iface = new ethers.utils.Interface(bridgeAbi);
	const topic = iface.getEventTopic("TokenRedeemAndRemove");
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);

	const amountToBeSwapped = fetchDetailsFromEvent(alchemyProvider, txHash, iface, topic);
	return amountToBeSwapped;
 }

 const cUSDTocUSDFromL1ToL2 = async (
    networkChainId,
    caller,
    destChainId,
    tokenAmount
 ) => {
    const constants = getNetworkConstants(networkChainId);
    const L1zapContract = new ethers.Contract(constants.L1BRIDGEZAP_ADDRESS, zapAbi, caller);
    const toAddress = caller.address;
    let origincUSD;
    if(networkChainId == "11155111"){
        origincUSD = new ethers.Contract(constants.LPT_DETAILS.address, tokenAbi, caller);
    }
    else{
        origincUSD = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, caller);
    }

    const tx = await L1zapContract.deposit(
        toAddress,
        destChainId,
        origincUSD.address,
        tokenAmount, {gasLimit : 6000000}
    )

    var txReceipt = await(await tx.wait());
	const txHash = await txReceipt.transactionHash;
	const iface = new ethers.utils.Interface(bridgeAbi);
	const topic = iface.getEventTopic("TokenDeposit");
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);

	const amount = fetchDetailsFromEvent(alchemyProvider, txHash, iface, topic);
	return amount;
 }

 const cUSDTocUSDFromL2ToL1 = async (
    networkChainId,
    caller,
    destChainId,
    tokenAmount
 ) => {
    const constants = getNetworkConstants(networkChainId);
    const L2zapContract = new ethers.Contract(constants.L2BRIDGEZAP_ADDRESS, L2zapAbi, caller);
    const toAddress = caller.address;
    const origincUSD = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, caller);

    const tx = await L2zapContract.redeem(
        toAddress,
        destChainId,
        origincUSD.address,
        tokenAmount, {gasLimit : 6000000}
    )

    var txReceipt = await(await tx.wait());
	const txHash = await txReceipt.transactionHash;
	const iface = new ethers.utils.Interface(bridgeAbi);
	const topic = iface.getEventTopic("TokenRedeem");
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);

	const amount = fetchDetailsFromEvent(alchemyProvider, txHash, iface, topic);
	return amount;
 }
 
 const approvalAddcUSDToZapL2ToL2 = async (
    networkChainId,
    caller,
    amount,
    tokenIndex = 3 // DEFAULT TO 3
  ) => {
    const constants = getNetworkConstants(networkChainId);
    let zapContract = new ethers.Contract(constants.L1BRIDGEZAP_ADDRESS, zapAbi, caller);
    let allowance;
    switch(tokenIndex){
        case 0:
            const DaiContract = new ethers.Contract(constants.tokenDetails[0].address, erc20Abi, caller);
            allowance = await checkAllowance(caller.address, zapContract.address, DaiContract);
            console.log(allowance);
            if(allowance < amount){
                console.log("Approving DAI token...");
                const approveTokens = await DaiContract.connect(caller).approve(
                    zapContract.address,
                    amount, {gasLimit : 6000000}
                );
                await approveTokens.wait();
            }
            break;
        case 1:
            const UsdcContract = new ethers.Contract(constants.tokenDetails[1].address, erc20Abi, caller);
            allowance = await checkAllowance(caller.address, zapContract.address, UsdcContract);
            console.log(allowance);
            if(allowance < amount){
                console.log("Approving USDC token...");
                const approveTokens = await UsdcContract.connect(caller).approve(
                    zapContract.address,
                    amount, {gasLimit : 6000000}
                );
                await approveTokens.wait();
            }
            break;
        case 2:
            const UsdtContract = new ethers.Contract(constants.tokenDetails[2].address, erc20Abi, caller);
            allowance = await checkAllowance(caller.address, zapContract.address, UsdtContract);
            console.log(allowance);
            if(allowance < amount){
                console.log("Approving USDT token...");
                const approveTokens = await UsdtContract.connect(caller).approve(
                    zapContract.address,
                    amount, {gasLimit : 6000000}
                );
                await approveTokens.wait();
            }
            break;
        case 3:
            const cUSDContract = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, caller);
            allowance = await checkAllowance(caller.address, zapContract.address, cUSDContract);
            console.log(allowance);
            if(allowance < amount){
                console.log("Approving cUSD token...");
                const approveTokens = await cUSDContract.connect(caller).approve(
                    zapContract.address,
                    amount, {gasLimit : 6000000}
                );
                await approveTokens.wait();
            }
            break;
    }
    return allowance;
 }

 async function fetchDetailsFromEvent(alchemyProvider, txHash, iface, topic) {
     let txReceipt = await alchemyProvider.getTransactionReceipt(txHash)
     if(txReceipt == null) {
         let txData = await alchemyProvider.getTransaction(txHash);
         txReceipt = await txData.wait();
     }
     const logs = txReceipt.logs;
     const filtered = logs.filter((log) => log.topics[0] == topic);
     const parsedEvent = iface.parseLog(filtered[0])
     return parsedEvent.args;
 }

 module.exports = {
    approvalAddLiquidityToZap,
    approvalAddTokenToZap,
    stableToStableFromL1ToL2,
    stableTocUSDFromL1ToL2,
    stableToStableFromL2ToL1,
    stableTocUSDFromL2ToL1,
    cUSDToStableFromL1ToL2,
    cUSDToStableFromL2ToL1,
    cUSDTocUSDFromL1ToL2,
    cUSDTocUSDFromL2ToL1,
    approvalAddcUSDToZapL2ToL2
 };
 