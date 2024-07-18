const { ethers, network } = require("hardhat");
const { utils } = require("ethers");
const fs = require("fs");
const { deployedLPToken  } = require("./deploy_LPToken");
const { deployedSwapUtils  } = require("./deploy_SwapUtils");
const { deployedAmplificationUtils  } = require("./deploy_AmplificationUtils");
const { deployedSwap } = require("./deploy_Swap");
const { deployedSwapDeployer  } = require("./deploy_SwapDeployer");
const { deployedStableSwapPool } = require("./deploy_StableSwapPool");
const { deployedPoolTokens } = require("./deploy_PoolTokens");
const { deployedCrossHop } = require("./deploy_CrossHop");
const { deployedL1BridgeZap } = require("./deploy_L1BridgeZap");
const { deployedL2BridgeZap } = require('./deploy_L2BridgeZap');

async function main() {
    const chainId = network.config.chainId;
    const [deployer] = await ethers.getSigners();
    // console.log("Deployer Address: ",deployer.address);
    // const balanceBefore = (await deployer.provider.getBalance(deployer.address))
    // console.log("Balance Before: ", utils.formatEther(balanceBefore.toString()), "\n")

    // const deployedLPTokenObject = await deployedLPToken(deployer);
    // console.log("Deployed LPToken_Implementation Address : ", deployedLPTokenObject.address, "\n"); 
    // const deployedSwapUtilsObject = await deployedSwapUtils(deployer);
    // const deployedSwapUtilsContract = deployedSwapUtilsObject.instance;
    // console.log("Deployed SwapUtils Address : ", deployedSwapUtilsContract.address, "\n"); 
    // const deployedAmplificationUtilsObject = await deployedAmplificationUtils(deployer);
    // const deployedAmplificationUtilsContract = deployedAmplificationUtilsObject.instance;
    // console.log("Deployed AmplificationUtils Address : ", deployedAmplificationUtilsContract.address, "\n"); 
    // const deployedSwapObject = await deployedSwap(
    //   deployer, 
    //   deployedSwapUtilsContract.address, 
    //   deployedAmplificationUtilsContract.address
    // );
    // console.log("Deployed Swap_Implementation Address : ", deployedSwapObject.address, "\n"); 
    // const deployedSwapDeployerObject = await deployedSwapDeployer(deployer);
    // console.log("Deployed SwapDeployer Address : ", deployedSwapDeployerObject.address, "\n"); 

    // var pooledTokens = []
    // var pooledTokensDecimals = []

    // if(network.name == "hardhat"){ 
    //   const deployedPoolTokensObject = await deployedPoolTokens(deployer);
    //   pooledTokens = deployedPoolTokensObject.addresses;
    //   pooledTokensDecimals = ["18", "6", "6"]
    // }
    // else{
    //   if(network.name == "sepolia"){
    //     pooledTokens = [
    //                       "0xbf957Ca3C8835882448F53Af4624E8f72D785504", // DAI
    //                       "0x511657d65a6f7b9762c6d2ea53d5e63bd772f1a9", // USDC
    //                       "0x4b33e92FEE95b9261b4d03fb91E3F888D38fafE1" // USDT
    //                     ]
    //     pooledTokensDecimals = ["18", "6", "6"]
    //   }
    //   if(network.name == "arbiSepolia"){ // Verified
    //     pooledTokens = [
    //                       "0x4DBba1a19E79134334cb01C5423b7D3CBD9D4a38", // DAI
    //                       "0xFd0CbabC8F73362DD55312244188A01D371D172D", // USDC
    //                       "0xFC1a35c06E24C1718e04410c61a3985CEf829fEF", // USDT
    //                       "0xFd5c43403ea34a3c24a64310d2fF0dC3c017C12D" // cUSD
    //                     ]
    //     pooledTokensDecimals = ["18", "6", "6", "18"]
    //   }
    //   if(network.name == "optiSepolia"){ // Verified
    //     pooledTokens = [
    //                       "0xF961289be21FfC4316c43D8E6Bf166d99e024fAc", // DAI
    //                       "0xD0d62ce0c8e2f439F051437e8727d4f86160d630", // USDC
    //                       "0x6aeB9fc9fE9e16DF047906E926Df6b292d4774D2", // USDT
    //                       "0x5aEAe29A2CEef6AB96Ba3924eb19D15a696db11A" // cUSD
    //                     ]
    //     pooledTokensDecimals = ["18", "6", "6", "18"]
    //   }
    //   if(network.name == "amoy"){ // Verified
    //     pooledTokens = [
    //                       "0xfaF4eD5628A1793c4F023Cf6B5e054C81a5a4E1C", // DAI
    //                       "0x6AA6C80C3103e2f7150DCdb9c5D5E147ec11dD13", // USDC
    //                       "0xcA742406B7DB07342B8451808252c07a791d3077", // USDT
    //                       "0x1096a8E1faC8860fec88DC271D7D5685Fa43DCf2" // cUSD
    //                     ]
    //     pooledTokensDecimals = ["18", "6", "6", "18"]
    //   }
    //   if(network.name == "fuji"){ // Verified
    //     pooledTokens = [
    //                       "0xfaF4eD5628A1793c4F023Cf6B5e054C81a5a4E1C", // DAI
    //                       "0x1096a8E1faC8860fec88DC271D7D5685Fa43DCf2", // USDC
    //                       "0xAF54aD69b610c8573eD0b284952a0e0F93324910", // USDT
    //                       "0xEB61E5C48ec51f41e5Cc0Cbf46e5b0bF5fb87057" // cUSD
    //                     ]
    //     pooledTokensDecimals = ["18", "6", "6", "18"]
    //   }
    //   if(network.name == "fantomTestnet"){ // Verified
    //     pooledTokens = [
    //                       "0xfaF4eD5628A1793c4F023Cf6B5e054C81a5a4E1C", // DAI
    //                       "0x6AA6C80C3103e2f7150DCdb9c5D5E147ec11dD13", // USDC
    //                       "0xAF54aD69b610c8573eD0b284952a0e0F93324910", // USDT
    //                       "0x7637e9B1DfB603713cA52ee0d67116eb07b53A20" // cUSD
    //                     ]
    //     pooledTokensDecimals = ["18", "6", "6", "18"]
    //   }
    //   if(network.name == "bnbTestnet"){ // Verified
    //     pooledTokens = [
    //                       "0x3C90356B630554532E269fB710B5fE836285A480", // DAI
    //                       "0x16278c2a3fB2309Cd17bC3a4D183833AD0D21e98", // USDC
    //                       "0xcAcEcbFD18172f86a71f429703914DC06dF0d50a", // USDT
    //                       "0xd3Ad85D54327e8861d4A10e3876C17a989BAfB5E" // cUSD
    //                     ]
    //     pooledTokensDecimals = ["18", "6", "6", "18"]
    //   }
    //   if(network.name == "mainnet"){ // Verified
    //     pooledTokens = [
    //                       "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
    //                       "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    //                       "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    //                     ]
    //     pooledTokensDecimals = ["18", "6", "6", "18"]
    //   }
    //   if(network.name == "optimism"){ // Verified
    //     pooledTokens = [
    //                       "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", // DAI
    //                       "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", // USDC
    //                       "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", // USDT
    //                       "" // cUSD
    //                     ]
    //     pooledTokensDecimals = ["18", "6", "6", "18"]
    //   }
    //   if(network.name == "arbitrum"){ // Verified
    //     pooledTokens = [
    //                       "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1", // DAI
    //                       "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC
    //                       "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", // USDT
    //                       "" // cUSD
    //                     ]
    //     pooledTokensDecimals = ["18", "6", "6", "18"]
    //   }
    //   if(network.name == "polygon"){ // Verified
    //     pooledTokens = [
    //                       "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // DAI
    //                       "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
    //                       "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT
    //                       "" // cUSD
    //                     ]
    //     pooledTokensDecimals = ["18", "6", "6", "18"]
    //   }
    // }
    // console.log("Deployed Pooled Tokens(DAI,USDC,USDT,cUSD) Addresses : \n", pooledTokens)

    // const WETHAddress = "0xFC1a35c06E24C1718e04410c61a3985CEf829fEF" 

    // const INITIAL_A = 2000
    // const SWAP_FEE = 4e6 // 4bps
    // const ADMIN_FEE = 0
    // const deployedStableSwapPoolAddress = await deployedStableSwapPool(
    //                                                                   deployer,
    //                                                                   deployedSwapDeployerObject.address,
    //                                                                   deployedSwapObject.address,
    //                                                                   pooledTokens,
    //                                                                   pooledTokensDecimals,
    //                                                                   INITIAL_A,
    //                                                                   SWAP_FEE,
    //                                                                   ADMIN_FEE,
    //                                                                   deployedLPTokenObject.address,
    //                                                                   network.name
    //                                                                 );
    // console.log("Deployed StableSwapPool Address : ", deployedStableSwapPoolAddress, "\n");

    // const deployedCrossHopObject = await deployedCrossHop(deployer);
    // console.log("Deployed CrossHop Address : ", deployedCrossHopObject.address, "\n"); 

    // const StableSwapAddress = deployedStableSwapPoolAddress
    // const cUSDAddress = pooledTokens[3]
    // const crossHopAddress = deployedCrossHopObject.address

    // const deployedL1BridgeZapObject = await deployedL1BridgeZap(
    //   deployer, 
    //   WETHAddress, 
    //   StableSwapAddress, 
    //   crossHopAddress
    // );
    // console.log("Deployed L1BridgeZap Address : ", deployedL1BridgeZapObject.address, "\n"); 
    // const deployedL2BridgeZapObject = await deployedL2BridgeZap(
    //   deployer, 
    //   WETHAddress, 
    //   StableSwapAddress, 
    //   cUSDAddress,
    //   crossHopAddress
    // );
    // console.log("Deployed L2BridgeZap Address : ", deployedL2BridgeZapObject.address, "\n"); 

    // const addresses = {
    //   "DEPLOYED_LPTOKEN_IMPL_ADDRESS" : deployedLPTokenObject.address,
    //   "DEPLOYED_SWAP_UTILS_ADDRESS" : deployedSwapUtilsContract.address,
    //   "DEPLOYED_AMPLIFICATION_UTILS_ADDRESS" : deployedAmplificationUtilsContract.address,
    //   "DEPLOYED_SWAP_IMPL_ADDRESS" : deployedSwapObject.address,
    //   "DEPLOYED_SWAP_DEPLOYER_ADDRESS" : deployedSwapDeployerObject.address,
    //   "POOLED_TOKEN_ADDRESSES" : pooledTokens,
    //   "DEPLOYED_STABLESWAPPOOL_ADDRESS" : deployedStableSwapPoolAddress,
    //   "DEPLOYED_CROSSHOP_ADDRESS" : deployedCrossHopObject.address,
    //   "DEPLOYED_L1_BRIDGEZAP_ADDRESS" : deployedL1BridgeZapObject.address,
    //   "DEPLOYED_L2_BRIDGEZAP_ADDRESS" : deployedL2BridgeZapObject.address
    // }

    // const json_addresses = JSON.stringify(addresses);
    // fs.writeFileSync(`./deploy/deployments/${network.name}.json`, json_addresses);
    // console.log("Addresses Recorded to: " + `deploy/deployments/${network.name}.json`);

    // * only verify on testnets or mainnets.
    if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
      // await verify(deployedLPTokenObject.address, []);
      // await verify(deployedSwapObject.address, []);
      // await verify(deployedCrossHopObject.address, []);
      // await verify(deployedL1BridgeZapObject.address, deployedL1BridgeZapObject.args);
      // await verify(deployedL2BridgeZapObject.address, deployedL2BridgeZapObject.args);
      // await verify("0x28d53350133E7CfFD838E871C5A5B8b6C3589aEA", []);
    //   await verify("0x4d203D94C452e58C5f2B7084eA534A0fd83945e1", []);
    //   await verify("0xbb5DFa46AD7dEcaadfDF06106D87dc0Bc5BC3f20", []);
    //   await verify("0xFdf171E8dB8A5Ca3237bdC37d455a605cDFb5CB9",
    //   [
    //     WETHAddress,
    //     StableSwapAddress,
    //     crossHopAddress
    //   ]
    // );
    //   await verify("0x76e7D745C9D6DB39310ac4EEb225C397334CdbB2",
    //     [
    //       WETHAddress,
    //       StableSwapAddress,
    //       cUSDAddress,
    //       "0x0000000000000000000000000000000000000000",
    //       "0x0000000000000000000000000000000000000000",
    //       crossHopAddress
    //     ]
    //   );
    }
  }

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
      await run("verify:verify", {
          address: contractAddress,
          constructorArguments: args,
      });
  } catch (e) {
      if (e.message.toLowerCase().includes("already verified")) {
          console.log("Already verified!");
      } else {
          console.log(e);
      }
  }
};
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });