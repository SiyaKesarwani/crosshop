require("dotenv").config();

const chainConfig = {
	"11155111" : {
		// Sepolia Testnet Updated
		tokenDetails : [
			// Array index represents the token index in StableSwapPool
			{
				address: '0xbf957Ca3C8835882448F53Af4624E8f72D785504',
				decimals: '18',
				name: 'DAI'
			},
			{
				address: '0x511657d65a6f7b9762c6d2ea53d5e63bd772f1a9',
				decimals: '6',
				name: 'USDC'
			},
			{
				address: '0x4b33e92FEE95b9261b4d03fb91E3F888D38fafE1',
				decimals: '6',
				name: 'USDT'
			}
		],
		LPT_DETAILS : {
			address: '0xd91Bd6B41CE83667e89c466Ca2274E82Cc0cA6aA',
			decimals: '18',
			name: 'CrossHop USD'
		},
		STABLESWAPPOOL_ADDRESS : '0xfeF64c4e0aAaF29668f8B2575d8d71887246dB54',
		CROSSHOP_ADDRESS : '0x7F3157C6e17ec8dE6B95C0177d64843F1b98604d',
		L1BRIDGEZAP_ADDRESS : '0xC79CAb4399daeF1a83770b4607A946856C9bE007',
		RPC_NODE_URL : process.env.SEPOLIA_API
	},
	"421614" : {
		// ArbiSepolia Testnet
		tokenDetails : [
			// Array index represents the token index in StableSwapPool
			{
				address: '0x4DBba1a19E79134334cb01C5423b7D3CBD9D4a38',
				decimals: '18',
				name: 'DAI'
			},
			{
				address: '0xFd0CbabC8F73362DD55312244188A01D371D172D',
				decimals: '6',
				name: 'USDC'
			},
			{
				address: '0xFC1a35c06E24C1718e04410c61a3985CEf829fEF',
				decimals: '6',
				name: 'USDT'
			},
			{
				address: '0xFd5c43403ea34a3c24a64310d2fF0dC3c017C12D',
				decimals: '18',
				name: 'cUSD'
			},
		],
		LPT_DETAILS : {
			address: '0x9092F1C9aaBd1244bAbfaD4e49AD4a64B441650c',
			decimals: '18',
			name: 'arbiSepolia LP Token'
		},
		STABLESWAPPOOL_ADDRESS : '0x63b4403650a15772502161f7174D8A139F64682F',
		CROSSHOP_ADDRESS : '0x1f61780E971034426a72eCB215671C836F9Cf40F',
		L1BRIDGEZAP_ADDRESS : '0xB9406a7b2490d5A83544e83f189aF440F4938788',
		L2BRIDGEZAP_ADDRESS : '0x6F83534E7E7632F1bc0920C7aD9447594c3337Df',
		RPC_NODE_URL : process.env.ARBI_SEPOLIA_API
	},
	"11155420" : {
		// OptiSepolia Testnet
		tokenDetails : [
			// Array index represents the token index in StableSwapPool
			{
				address: '0xF961289be21FfC4316c43D8E6Bf166d99e024fAc',
				decimals: '18',
				name: 'DAI'
			},
			{
				address: '0xD0d62ce0c8e2f439F051437e8727d4f86160d630',
				decimals: '6',
				name: 'USDC'
			},
			{
				address: '0x6aeB9fc9fE9e16DF047906E926Df6b292d4774D2',
				decimals: '6',
				name: 'USDT'
			},
			{
				address: '0x5aEAe29A2CEef6AB96Ba3924eb19D15a696db11A',
				decimals: '18',
				name: 'cUSD'
			},
		],
		LPT_DETAILS : {
			address: '0xe5E8aFC646d41ceDCa0Cca3DE007c1a21E2C1d74',
			decimals: '18',
			name: 'optiSepolia LP Token'
		},
		STABLESWAPPOOL_ADDRESS : '0xaa6F3ACbDF0dCdAFdB41f365c1F5b6c3C68d128D',
		CROSSHOP_ADDRESS : '0x1F6C576df766B7ffE6df1977a350030542BB7598',
		L1BRIDGEZAP_ADDRESS : '0xbD9ca7836fB49234878a727c431292aCA2e3C51f',
		L2BRIDGEZAP_ADDRESS : '0xE6f08E71C1162f40801dB990099fD8F95f6F0415',
		RPC_NODE_URL : process.env.OPTI_SEPOLIA_API
	},
	"80002" : {
		// Amoy Testnet
		tokenDetails : [
			// Array index represents the token index in StableSwapPool
			{
				address: '0xfaF4eD5628A1793c4F023Cf6B5e054C81a5a4E1C',
				decimals: '18',
				name: 'DAI'
			},
			{
				address: '0x6AA6C80C3103e2f7150DCdb9c5D5E147ec11dD13',
				decimals: '6',
				name: 'USDC'
			},
			{
				address: '0xcA742406B7DB07342B8451808252c07a791d3077',
				decimals: '6',
				name: 'USDT'
			},
			{
				address: '0x1096a8E1faC8860fec88DC271D7D5685Fa43DCf2',
				decimals: '18',
				name: 'cUSD'
			},
		],
		LPT_DETAILS : {
			address: '0xC2Ea1f6C045f28974d68858C71b638E12330D1DB',
			decimals: '18',
			name: 'amoy LP Token'
		},
		STABLESWAPPOOL_ADDRESS : '0x921420dEdd90634E2ADE11fdB26D483bA01252Aa',
		CROSSHOP_ADDRESS : '0xe7563cE6b4BF9b7613246B2A954a652fCB2aeA54',
		L1BRIDGEZAP_ADDRESS : '0x646cf3E233b691AFdF35038a18f9743fD4fDe043',
		L2BRIDGEZAP_ADDRESS : '0xCB321AAca8a662Bdfca72b8ab460353c465D0f18',
		RPC_NODE_URL : process.env.AMOY_API
	},
	"43113" : {
		// Avalanche Fuji C-chain Testnet (Snowtrace explorer)
		tokenDetails : [
			// Array index represents the token index in StableSwapPool
			{
				address: '0xfaF4eD5628A1793c4F023Cf6B5e054C81a5a4E1C',
				decimals: '18',
				name: 'DAI'
			},
			{
				address: '0x1096a8E1faC8860fec88DC271D7D5685Fa43DCf2',
				decimals: '6',
				name: 'USDC'
			},
			{
				address: '0xAF54aD69b610c8573eD0b284952a0e0F93324910',
				decimals: '6',
				name: 'USDT'
			},
			{
				address: '0xEB61E5C48ec51f41e5Cc0Cbf46e5b0bF5fb87057',
				decimals: '18',
				name: 'cUSD'
			},
		],
		LPT_DETAILS : {
			address: '',
			decimals: '18',
			name: 'snowtrace LP Token'
		},
		STABLESWAPPOOL_ADDRESS : '',
		CROSSHOP_ADDRESS : '',
		L1BRIDGEZAP_ADDRESS : '',
		L2BRIDGEZAP_ADDRESS : '',
		RPC_NODE_URL : process.env.SNOWTRACE_API
	},
	"4002" : {
		// Fantom Testnet
		tokenDetails : [
			// Array index represents the token index in StableSwapPool
			{
				address: '0xfaF4eD5628A1793c4F023Cf6B5e054C81a5a4E1C',
				decimals: '18',
				name: 'DAI'
			},
			{
				address: '0x6AA6C80C3103e2f7150DCdb9c5D5E147ec11dD13',
				decimals: '6',
				name: 'USDC'
			},
			{
				address: '0xAF54aD69b610c8573eD0b284952a0e0F93324910',
				decimals: '6',
				name: 'USDT'
			},
			{
				address: '0x7637e9B1DfB603713cA52ee0d67116eb07b53A20',
				decimals: '18',
				name: 'cUSD'
			},
		],
		LPT_DETAILS : {
			address: '0x25493F76F4c1403DB909431fF1630D27104991D1',
			decimals: '18',
			name: 'fantomTestnet LP Token'
		},
		STABLESWAPPOOL_ADDRESS : '0x669a6680EeFC029d85326580D23149978565b4A7',
		CROSSHOP_ADDRESS : '0xADB4c067d911bDe2315f9eA76b9Ce22E4cE0Bf56',
		L1BRIDGEZAP_ADDRESS : '0x20b04762007a05fcc7D121E2fF6cE0C8FA80Fc50',
		L2BRIDGEZAP_ADDRESS : '0xd3797E39e7227c86cAA8A81006cbA6CC77661732',
		RPC_NODE_URL : process.env.FANTOMTESTNET_API
	},
	"97" : {
		// BNB Testnet
		tokenDetails : [
			// Array index represents the token index in StableSwapPool
			{
				address: '0x3C90356B630554532E269fB710B5fE836285A480',
				decimals: '18',
				name: 'DAI'
			},
			{
				address: '0x16278c2a3fB2309Cd17bC3a4D183833AD0D21e98',
				decimals: '6',
				name: 'USDC'
			},
			{
				address: '0xcAcEcbFD18172f86a71f429703914DC06dF0d50a',
				decimals: '6',
				name: 'USDT'
			},
			{
				address: '0xd3Ad85D54327e8861d4A10e3876C17a989BAfB5E',
				decimals: '18',
				name: 'cUSD'
			},
		],
		LPT_DETAILS : {
			address: '0x6132f55aB2b8F34188a3304A770F9C5fB1ca11cB',
			decimals: '18',
			name: 'bnbTestnet LP Token'
		},
		STABLESWAPPOOL_ADDRESS : '0x7C4B05CF84FCDC00421CB9C54B21cF7AfFA0eB9d',
		CROSSHOP_ADDRESS : '0xA1D35167a5016cB354E9506f26eAaB98726Cb515',
		L1BRIDGEZAP_ADDRESS : '0xAd598585be7f055567011380966fD8d31490f14d',
		L2BRIDGEZAP_ADDRESS : '0xEB61E5C48ec51f41e5Cc0Cbf46e5b0bF5fb87057',
		RPC_NODE_URL : process.env.BNBTESTNET_API
	}
}

module.exports = {
	chainConfig
}
