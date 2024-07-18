const { 
   chainConfig
} = require("../utils/constants");

const {
    swapAbi,
    erc20Abi,
    tokenAbi
} = require("../abis/index.js");
                                              
const {ethers} = require('ethers');

function getNetworkConstants(networkChainId){
   return chainConfig[networkChainId];
}

 const checkAllowance = async (
    ownerAddress,
    poolAddress,
    token
 ) => {
    const tokenAllowance = await token.allowance(ownerAddress, poolAddress);
    return tokenAllowance;
 }
 
 const approvalAddLiquidityToStablePool = async (
    networkChainId,
    caller,
    amounts
  ) => {
    const constants = getNetworkConstants(networkChainId);
    const stableSwapContract = new ethers.Contract(constants.STABLESWAPPOOL_ADDRESS, swapAbi, caller);
    if(networkChainId != "11155111"){
        if(amounts[3] > BigInt(Number(0))){
            const cUSDContract = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, caller);
            const allowance = await checkAllowance(caller.address, stableSwapContract.address, cUSDContract);
            console.log(allowance);
            if(allowance < amounts[3]){
                console.log("Approving cUSD token...");
                const approveTokens = await cUSDContract.connect(caller).approve(
                  stableSwapContract.address,
                  amounts[3], {gasLimit : 6000000}
                );
                await approveTokens.wait();
            }
        }
    }
    if (amounts[0] > BigInt(Number(0))) {
        const DaiContract = new ethers.Contract(constants.tokenDetails[0].address, erc20Abi, caller);
        const allowance = await checkAllowance(caller.address, stableSwapContract.address, DaiContract);
        console.log(allowance);
        if(allowance < amounts[0]){
            console.log("Approving DAI token...");
            const approveTokens = await DaiContract.connect(caller).approve(
              stableSwapContract.address,
              amounts[0], {gasLimit : 6000000}
            );
            await approveTokens.wait();
        }
    }
    if (amounts[1] > BigInt(Number(0))) {
        const UsdcContract = new ethers.Contract(constants.tokenDetails[1].address, erc20Abi, caller);
        const allowance = await checkAllowance(caller.address, stableSwapContract.address, UsdcContract);
        console.log(allowance);
        if(allowance < amounts[1]){
            console.log("Approving USDC token...");
            const approveTokens = await UsdcContract.connect(caller).approve(
              stableSwapContract.address,
              amounts[1], {gasLimit : 6000000}
            );
            await approveTokens.wait();
        }
    }
    if (amounts[2] > BigInt(Number(0))) {
        const UsdtContract = new ethers.Contract(constants.tokenDetails[2].address, erc20Abi, caller);
        const allowance = await checkAllowance(caller.address, stableSwapContract.address, UsdtContract);
        console.log(allowance);
        if(allowance < amounts[2]){
            console.log("Approving USDT token...");
            const approveTokens = await UsdtContract.connect(caller).approve(
              stableSwapContract.address,
              amounts[2], {gasLimit : 6000000}
            );
            await approveTokens.wait();
        }
    }
}

 const addLiquidityToStablePool = async (
    networkChainId,
    caller,
    amountsToAdd,
    minToMint,
    deadLine
) => {
    const constants = getNetworkConstants(networkChainId);
    const stableSwapContract = new ethers.Contract(constants.STABLESWAPPOOL_ADDRESS, swapAbi, caller);
    console.log("Adding liquidity...");
    const addTx = await stableSwapContract.connect(caller).addLiquidity(
        amountsToAdd, 
        minToMint, 
        deadLine, {gasLimit : 6000000}
    );

    var txReceipt = await(await addTx.wait());
	const txHash = await txReceipt.transactionHash;
	const iface = new ethers.utils.Interface(swapAbi);
	const topic = iface.getEventTopic("AddLiquidity");
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);

	const mintedLPTokens = fetchLPTokensFromEvent(alchemyProvider, txHash, iface, topic);
	return mintedLPTokens;
}

const approvalRemoveLiquidityFromStablePool = async (
    networkChainId,
    caller,
    amount            
) => {
    const constants = getNetworkConstants(networkChainId);
    const stableSwapContract = new ethers.Contract(constants.STABLESWAPPOOL_ADDRESS, swapAbi, caller);
    const LPTokenContract = new ethers.Contract(constants.LPT_DETAILS.address, tokenAbi, caller);
    console.log(await LPTokenContract.owner())
    const allowance = await checkAllowance(caller.address, stableSwapContract.address, LPTokenContract);
    console.log(allowance);
    if(allowance < amount){
        console.log("Approving Swap contract to burn LP tokens...");
        const approveTokens = await LPTokenContract.connect(caller).approve(stableSwapContract.address, 
                                amount, {gasLimit : 6000000}
                            );
        await approveTokens.wait();
    }
}
                         
 const removeLiquidityFromStablePool = async (
    networkChainId,
    caller,
    minAmounts,
    amount,
    deadLine
) => {
    const constants = getNetworkConstants(networkChainId);
    const stableSwapContract = new ethers.Contract(constants.STABLESWAPPOOL_ADDRESS, swapAbi, caller);
    console.log("Removing liquidity...");
    const removeTx = await stableSwapContract.connect(caller).removeLiquidity(
        amount,
        minAmounts,
        deadLine, {gasLimit : 6000000}
    );

    var txReceipt = await(await removeTx.wait());
	const txHash = await txReceipt.transactionHash;
	const iface = new ethers.utils.Interface(swapAbi);
	const topic = iface.getEventTopic("RemoveLiquidity");
    const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);

	let amountsReceived = fetchAmountsReceivedFromEvent(alchemyProvider, txHash, iface, topic);
    return(amountsReceived);
}

const approvalSwapUsingStablePool = async (
    networkChainId,
    caller,
    fromTokenIndex,
    amountDx
) => {
    const constants = getNetworkConstants(networkChainId);
    const stableSwapContract = new ethers.Contract(constants.STABLESWAPPOOL_ADDRESS, swapAbi, caller);
    let approveTokens;
    switch(fromTokenIndex){
        case 0:
            const DaiContract = new ethers.Contract(constants.tokenDetails[0].address, erc20Abi, caller);
            allowance = await checkAllowance(caller.address, stableSwapContract.address, DaiContract);
            console.log(allowance);
            if(allowance < amountDx){
                console.log("Approving DAI token...");
                approveTokens = await DaiContract.connect(caller).approve(stableSwapContract.address, 
                                        amountDx, {gasLimit : 6000000}
                                    );
                                    await approveTokens.wait();
            }
            break;
        case 1:
            const UsdcContract = new ethers.Contract(constants.tokenDetails[1].address, erc20Abi, caller);
            allowance = await checkAllowance(caller.address, stableSwapContract.address, UsdcContract);
            console.log(allowance);
            if(allowance < amountDx){
                console.log("Approving USDC token...");
                approveTokens = await UsdcContract.connect(caller).approve(stableSwapContract.address, 
                                        amountDx, {gasLimit : 6000000}
                                    );
                                    await approveTokens.wait();
            }
            break;
        case 2:
            const UsdtContract = new ethers.Contract(constants.tokenDetails[2].address, erc20Abi, caller);
            allowance = await checkAllowance(caller.address, stableSwapContract.address, UsdtContract);
            console.log(allowance);
            if(allowance < amountDx){
                console.log("Approving USDT token...");
                approveTokens = await UsdtContract.connect(caller).approve(stableSwapContract.address, 
                                        amountDx, {gasLimit : 6000000}
                                    );
                                    await approveTokens.wait();
            }
            break;
        case 3:
            const cUSDContract = new ethers.Contract(constants.tokenDetails[3].address, tokenAbi, caller);
            allowance = await checkAllowance(caller.address, stableSwapContract.address, cUSDContract);
            console.log(allowance);
            if(allowance < amountDx){
                console.log("Approving cUSD token...");
                approveTokens = await cUSDContract.connect(caller).approve(stableSwapContract.address, 
                                        amountDx, {gasLimit : 6000000}
                                    );
                                    await approveTokens.wait();
            }
            break;
    }
}

const swapUsingStablePool = async (
    networkChainId,
    caller,
    fromTokenIndex,
    toTokenIndex,
    amountDx,
    minDy,
    deadLine
) => {
    const constants = getNetworkConstants(networkChainId);
    const stableSwapContract = new ethers.Contract(constants.STABLESWAPPOOL_ADDRESS, swapAbi, caller);
    console.log("Swapping in progress...");
    const swapTx = await stableSwapContract.connect(caller).swap(
        fromTokenIndex,
        toTokenIndex,
        amountDx,
        minDy, 
        deadLine, {gasLimit : 6000000}
    );

   var txReceipt = await(await swapTx.wait());
   const txHash = await txReceipt.transactionHash;
   const iface = new ethers.utils.Interface(swapAbi);
   const topic = iface.getEventTopic("TokenSwap");
   const alchemyProvider = new ethers.providers.JsonRpcProvider(constants.RPC_NODE_URL);

   const receivedToTokens = fetchBoughtTokensFromEvent(alchemyProvider, txHash, iface, topic);
   return receivedToTokens;
}   

async function fetchLPTokensFromEvent(alchemyProvider, txHash, iface, topic) {
	let txReceipt = await alchemyProvider.getTransactionReceipt(txHash)
	if(txReceipt == null) {
		let txData = await alchemyProvider.getTransaction(txHash);
		txReceipt = await txData.wait();
	}
    const logs = txReceipt.logs;
    const filtered = logs.filter((log) => log.topics[0] == topic);
	const parsedEvent = iface.parseLog(filtered[0])
	return parsedEvent.args.lpTokenSupply;
}

async function fetchAmountsReceivedFromEvent(alchemyProvider, txHash, iface, topic) {
	let txReceipt = await alchemyProvider.getTransactionReceipt(txHash)
	if(txReceipt == null) {
		let txData = await alchemyProvider.getTransaction(txHash);
		txReceipt = await txData.wait();
	}
    const logs = txReceipt.logs;
    const filtered = logs.filter((log) => log.topics[0] == topic);
	const parsedEvent = iface.parseLog(filtered[0])
	return parsedEvent.args.tokenAmounts;
}

async function fetchBoughtTokensFromEvent(alchemyProvider, txHash, iface, topic) {
	let txReceipt = await alchemyProvider.getTransactionReceipt(txHash)
	if(txReceipt == null) {
		let txData = await alchemyProvider.getTransaction(txHash);
		txReceipt = await txData.wait();
	}
    const logs = txReceipt.logs;
    const filtered = logs.filter((log) => log.topics[0] == topic);
	const parsedEvent = iface.parseLog(filtered[0])
	return parsedEvent.args.tokensBought;
}

module.exports = {
	addLiquidityToStablePool,
    removeLiquidityFromStablePool,
    swapUsingStablePool,
    approvalAddLiquidityToStablePool,
    approvalRemoveLiquidityFromStablePool,
    approvalSwapUsingStablePool
};
