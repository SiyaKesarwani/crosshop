const tokenAbi = require('./LPToken.json');
const erc20Abi = require('./GenericERC20.json');
const swapAbi = require('./Swap.json');
const bridgeAbi = require('./CrossHop.json');
const zapAbi = require('./L1BridgeZap.json');
const L2zapAbi = require('./L2BridgeZap.json');

module.exports = {
	tokenAbi,
	erc20Abi,
	swapAbi,
	bridgeAbi,
	zapAbi,
	L2zapAbi
};
