const { ethers } = require("hardhat");
require("dotenv").config();

const deployedStableSwapPool = async (
                                        deployer, 
                                        deployedSwapDeployerContractAddress, 
                                        deployedSwapContractAddress,
                                        pooledTokens,
                                        pooledTokensDecimals,
                                        INITIAL_A,
                                        SWAP_FEE,
                                        ADMIN_FEE,
                                        deployedLPTokenContractAddress,
                                        networkName
                                    ) => {
    var lpTokenName;
    var lpTokenSymbol;
    if(networkName != "sepolia"){
        lpTokenName = networkName + " LP Token";
        lpTokenSymbol = networkName + " LPT"
    }
    else{
        lpTokenName = "CrossHop USD";
        lpTokenSymbol = "cUSD"
    }
    const deployedSwapDeployerContract = await ethers.getContractAt('SwapDeployer', deployedSwapDeployerContractAddress);
    const swapCloneTransaction = await deployedSwapDeployerContract.connect(deployer).deploy(
                                                                                            deployedSwapContractAddress,
                                                                                            pooledTokens,
                                                                                            pooledTokensDecimals,
                                                                                            lpTokenName,
                                                                                            lpTokenSymbol,
                                                                                            INITIAL_A,
                                                                                            SWAP_FEE,
                                                                                            ADMIN_FEE,
                                                                                            deployedLPTokenContractAddress
                                                                                        , {gasLimit : 6000000});
    console.log(`Waiting for blocks confirmations of the deploying StableSwapPool contract...`);
    console.log(`Confirmed!`);

	const txReceipt = await(await swapCloneTransaction.wait());
	const txHash = await txReceipt.transactionHash;
	const iface = deployedSwapDeployerContract.interface;
	const topic = iface.getEventTopic("NewSwapPool");

	const createdSwapPoolAddress = fetchSwapContractFromEvent(txHash, iface, topic, deployer.provider);
	return createdSwapPoolAddress;
}

async function fetchSwapContractFromEvent(txHash, iface, topic, provider) {
	let txReceipt = await provider.getTransactionReceipt(txHash)
	if(txReceipt == null) {
		let txData = await provider.getTransaction(txHash);
		txReceipt = await txData.wait();
	}
    const logs = txReceipt.logs;
    const filtered = logs.filter((log) => log.topics[0] == topic);
	const parsedEvent = iface.parseLog(filtered[0])
	return parsedEvent.args.swapAddress;
}

module.exports = {
    deployedStableSwapPool
};
