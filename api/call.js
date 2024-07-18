 require("dotenv").config();
 const {ethers} = require('ethers');

const { 
  approvalAddLiquidityToStablePool,
	addLiquidityToStablePool,
  approvalRemoveLiquidityFromStablePool,
	removeLiquidityFromStablePool,
  approvalSwapUsingStablePool,
	swapUsingStablePool,
 } = require("./features/stablePool");

 const { 
    calculateMinDyForSwap,
    calculateMinToMintForAddLiquidity,
    calculateMinAmountsForRemoveLiquidity,
    checkAllowanceFE,
    calculateMinToMintInZap,
    getBalanceOfTokens,
    calculateMinAmountToReceiveInOneToken,
    calculateMinDyInZap,
    getNetworkConstants
  } = require("./features/poolGetters");

  const { 
    approvalAddLiquidityToZap,
    stableToStableFromL1ToL2,
    stableTocUSDFromL1ToL2,
    stableToStableFromL2ToL1,
    approvalAddTokenToZap,
    stableTocUSDFromL2ToL1,
    cUSDToStableFromL1ToL2,
    cUSDToStableFromL2ToL1,
    cUSDTocUSDFromL1ToL2,
    cUSDTocUSDFromL2ToL1,
    approvalAddcUSDToZapL2ToL2
   } = require("./features/zap");

   const {
    transferOwnershipToBridge,
    getOwnerOfLPToken,
    grantRoleToBridge,
   } = require("./features/extras")

 async function main() {
  const RPC_NODE_URL = process.env.BNBTESTNET_API;
  const alchemyProvider = new ethers.providers.JsonRpcProvider(RPC_NODE_URL);
  // // Signer
  const caller = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY_1, alchemyProvider);
  const VikasAddress = "0xaBD7a3d85758711753B5648fEF91919fd54B0178";
  const networkChainId = await caller.getChainId();

  //--------------- Get Balance --------------------------------------//

  // const address = caller.address;
  // const balanceArray = await getBalanceOfTokens(networkChainId, address);
  // console.log(balanceArray);

  //--------------- Transfer Ownership --------------------------------------//

  // const toAddress = getNetworkConstants(networkChainId).CROSSHOP_ADDRESS;
  // await transferOwnershipToBridge(networkChainId, caller, toAddress);
  // console.log("Transferred");
  // const owner = await getOwnerOfLPToken(networkChainId);
  // console.log(owner);

  //--------------- GrantRole --------------------------------------//

  const nodeGroupRole = "0xb5c00e6706c3d213edd70ff33717fac657eacc5fe161f07180cf1fcab13cc4cd";
  // const governanceRole = "0x71840dc4906352362b0cdaf79870196c8e42acafade72d5d5a6d59291253ceb1";
  const accountAddress = VikasAddress;
  await grantRoleToBridge(networkChainId, caller, nodeGroupRole, accountAddress);

  //--------------- cUSDTocUSDFromL2ToL1 --------------------------------------//

  // const destChainId  = "11155111";
  // const tokenAmount = ethers.BigNumber.from("10000000000000000000"); //50k * 10^18

  // const minValue = await calculateMinToMintInZap(networkChainId, [0, 0, 0, tokenAmount], true);
  // console.log(minValue);

  // await approvalAddTokenToZap(networkChainId, caller, tokenAmount);
  // console.log("Token approved...........")

  // const values = await cUSDTocUSDFromL2ToL1(
  //   networkChainId, 
  //   caller, 
  //   destChainId, 
  //   tokenAmount
  //   );
  // console.log(values);

  //--------------- cUSDTocUSDFromL1ToL2 --------------------------------------//

  // const destChainId  = "11155420";
  // const tokenAmount = ethers.BigNumber.from("10000000000000000000"); //50k * 10^18

  // const minValue = await calculateMinToMintInZap(destChainId, [0, 0, 0, tokenAmount], true);
  // console.log(minValue);

  // await approvalAddTokenToZap(networkChainId, caller, tokenAmount);
  // console.log("Token approved...........")

  // const values = await cUSDTocUSDFromL1ToL2(
  //   networkChainId, 
  //   caller, 
  //   destChainId, 
  //   tokenAmount
  //   );
  // console.log(values);

  //--------------- cUSDToStableFromL2ToL1 --------------------------------------//

  // const destChainId  = "11155111";
  // const tokenAmount = ethers.BigNumber.from("10000000000000000000"); //50k * 10^18
  // const destTokenIndex = 0;
  // const destMinWithdrawAmount = await calculateMinAmountToReceiveInOneToken(
  //     destChainId,
  //     tokenAmount,
  //     destTokenIndex
  //   );

  // await approvalAddTokenToZap(networkChainId, caller, tokenAmount);
  // console.log("Token approved...........")

  // const values = await cUSDToStableFromL2ToL1(
  //   networkChainId, 
  //   caller, 
  //   destChainId, 
  //   tokenAmount,
  //   destTokenIndex,
  //   destMinWithdrawAmount
  //   );
  // console.log(values);

  //--------------- cUSDToStableFromL1ToL2 --------------------------------------//

  // const destChainId  = "11155420";
  // const tokenAmount = ethers.BigNumber.from("10000000000000000000"); //50k * 10^18
  // const destSwapTokenIndexFrom = 3; // FIXED
  // const destSwapTokenIndexTo = 2;
  // const destMinDy = await calculateMinDyForSwap(
  //     destChainId,
  //     destSwapTokenIndexFrom,
  //     destSwapTokenIndexTo,
  //     tokenAmount
  // );

  // await approvalAddTokenToZap(networkChainId, caller, tokenAmount);
  // console.log("Token approved...........")

  // const values = await cUSDToStableFromL1ToL2(
  //   networkChainId, 
  //   caller, 
  //   destChainId, 
  //   tokenAmount,
  //   destSwapTokenIndexFrom,
  //   destSwapTokenIndexTo,
  //   destMinDy
  //   );
  // console.log(values);

  //--------------- stableToStableFromL2ToL1 --------------------------------------//

  // const destChainId  = "11155111";
  // const tokenAmount = ethers.BigNumber.from("2000000"); //50k * 10^18
  // const originSwapTokenIndexFrom = 2;
  // const originSwapTokenIndexTo = 3; // FIXED
  // const originMinDy = await calculateMinDyInZap(
  //     networkChainId,
  //     originSwapTokenIndexFrom,
  //     originSwapTokenIndexTo,
  //     tokenAmount
  // );
  // const destTokenIndex = 2;
  // const destMinWithdrawAmount = await calculateMinAmountToReceiveInOneToken(
  //   destChainId,
  //   originMinDy,
  //   destTokenIndex
  // );

  // await approvalAddTokenToZap(networkChainId, caller, tokenAmount, originSwapTokenIndexFrom);
  // console.log("Token approved...........")

  // const values = await stableToStableFromL2ToL1(
  //   networkChainId, 
  //   caller, 
  //   destChainId, 
  //   originSwapTokenIndexFrom,
  //   originSwapTokenIndexTo,
  //   tokenAmount,
  //   originMinDy,
  //   destTokenIndex,
  //   destMinWithdrawAmount,
  //   );
  // console.log(values);

    //--------------- stableTocUSDFromL2ToL1 --------------------------------------//
  
    // const destChainId  = "11155111";
    // const tokenAmount = ethers.BigNumber.from("10000000"); //50k * 10^
    // const originSwapTokenIndexFrom = 1;
    // const originSwapTokenIndexTo = 3; // FIXED
    // const originMinDy = await calculateMinDyInZap(
    //     networkChainId,
    //     originSwapTokenIndexFrom,
    //     originSwapTokenIndexTo,
    //     tokenAmount
    // );

    // await approvalAddTokenToZap(networkChainId, caller, tokenAmount, originSwapTokenIndexFrom);
    // console.log("Token approved...........")

    // const values = await stableTocUSDFromL2ToL1(
    //   networkChainId,
    //   caller,
    //   destChainId,
    //   originSwapTokenIndexFrom,
    //   originSwapTokenIndexTo,
    //   tokenAmount,
    //   originMinDy
    // );

    // console.log(values);

  //--------------- stableToStableFromL1ToL2 --------------------------------------//

  // const destChainId  = "80001";
  // const token0Amount = ethers.BigNumber.from("10000000000000000000"); //50k * 10^18
  // const token1Amount = ethers.BigNumber.from("0"); //50k * 10^6
  // const token2Amount = ethers.BigNumber.from("0"); //50k * 10^6
  // const token3Amount = ethers.BigNumber.from("0"); //50k * 10^18
  // let amountsToAdd;
  // if(networkChainId == "11155111"){
  //   amountsToAdd = [token0Amount, token1Amount, token2Amount];
  // }
  // else{
  //   amountsToAdd = [token0Amount, token1Amount, token2Amount, token3Amount];
  // }
  // const destSwapTokenIndexFrom = 3; // FIXED
  // const destSwapTokenIndexTo = 0;
  // const originMinToMintWithSlippage = await calculateMinToMintInZap(
  //     networkChainId,
  //     amountsToAdd,
  //     true
  // );
  // const destMinDy = await calculateMinDyForSwap(
  //     destChainId,
  //     destSwapTokenIndexFrom,
  //     destSwapTokenIndexTo,
  //     originMinToMintWithSlippage
  // );

  // await approvalAddLiquidityToZap(networkChainId, caller, amountsToAdd);
  // console.log("Tokens approved...........")

  // const values = await stableToStableFromL1ToL2(
  //   networkChainId, 
  //   caller, 
  //   destChainId, 
  //   amountsToAdd, 
  //   originMinToMintWithSlippage,
  //   destSwapTokenIndexFrom, 
  //   destSwapTokenIndexTo,
  //   destMinDy
  //   );

  //   console.log(values);

    //--------------- stableTocUSDFromL1ToL2 --------------------------------------//
  
    // const destChainId  = "80002";
    // const token0Amount = ethers.BigNumber.from("10000000000000000000"); //50k * 10^18
    // const token1Amount = ethers.BigNumber.from("0"); //50k * 10^6
    // const token2Amount = ethers.BigNumber.from("0"); //50k * 10^6
    // const token3Amount = ethers.BigNumber.from("0"); //50k * 10^18
    // let amountsToAdd;
    // if(networkChainId == "11155111"){
    //   amountsToAdd = [token0Amount, token1Amount, token2Amount];
    // }
    // else{
    //   amountsToAdd = [token0Amount, token1Amount, token2Amount, token3Amount];
    // }
    // const originMinToMintWithSlippage = await calculateMinToMintInZap(
    //     networkChainId,
    //     amountsToAdd,
    //     true
    // );
    // await approvalAddLiquidityToZap(networkChainId, caller, amountsToAdd);
    // console.log("Tokens approved...........")
  
    // const values = await stableTocUSDFromL1ToL2(
    //   networkChainId, 
    //   caller, 
    //   destChainId, 
    //   amountsToAdd, 
    //   originMinToMintWithSlippage
    //   );

    // console.log(values);

  //--------------- stableToStableFromL2ToL2 (use stableToStableFromL1ToL2) --------------------------------------//

  // const destChainId  = "43113";
  // const token0Amount = ethers.BigNumber.from("0"); //50k * 10^18
  // const token1Amount = ethers.BigNumber.from("1000000"); //50k * 10^6
  // const token2Amount = ethers.BigNumber.from("0"); //50k * 10^6
  // const token3Amount = ethers.BigNumber.from("0"); //50k * 10^18
  // let amountsToAdd;
  // if(networkChainId == "11155111"){
  //   amountsToAdd = [token0Amount, token1Amount, token2Amount];
  // }
  // else{
  //   amountsToAdd = [token0Amount, token1Amount, token2Amount, token3Amount];
  // }
  // const destSwapTokenIndexFrom = 3; // FIXED
  // const destSwapTokenIndexTo = 1;
  // const originMinToMintWithSlippage = await calculateMinToMintInZap(
  //     networkChainId,
  //     amountsToAdd,
  //     true
  // );
  // const destMinDy = await calculateMinDyForSwap(
  //     destChainId,
  //     destSwapTokenIndexFrom,
  //     destSwapTokenIndexTo,
  //     originMinToMintWithSlippage
  // );

  // await approvalAddLiquidityToZap(networkChainId, caller, amountsToAdd);
  // console.log("Tokens approved...........")

  // const values = await stableToStableFromL1ToL2(
  //   networkChainId, 
  //   caller, 
  //   destChainId, 
  //   amountsToAdd, 
  //   originMinToMintWithSlippage,
  //   destSwapTokenIndexFrom, 
  //   destSwapTokenIndexTo,
  //   destMinDy
  //   );

  //   console.log(values);

    //--------------- stableTocUSDFromL2ToL2 (use stableTocUSDFromL1ToL2) --------------------------------------//
  
    // const destChainId  = "11155420";
    // const token0Amount = ethers.BigNumber.from("50000000000000000000000"); //50k * 10^18
    // const token1Amount = ethers.BigNumber.from("50000000000"); //50k * 10^6
    // const token2Amount = ethers.BigNumber.from("50000000000"); //50k * 10^6
    // const token3Amount = ethers.BigNumber.from("0"); //50k * 10^18
    // let amountsToAdd;
    // if(networkChainId == "11155111"){
    //   amountsToAdd = [token0Amount, token1Amount, token2Amount];
    // }
    // else{
    //   amountsToAdd = [token0Amount, token1Amount, token2Amount, token3Amount];
    // }
    // const originMinToMintWithSlippage = await calculateMinToMintInZap(
    //     networkChainId,
    //     amountsToAdd,
    //     true
    // );
    // await approvalAddLiquidityToZap(networkChainId, caller, amountsToAdd);
    // console.log("Tokens approved...........")
  
    // const values = await stableTocUSDFromL1ToL2(
    //   networkChainId, 
    //   caller, 
    //   destChainId, 
    //   amountsToAdd, 
    //   originMinToMintWithSlippage
    //   );

    // console.log(values);

    //--------------- cUSDToStableFromL2ToL2 (use cUSDToStableFromL1ToL2) --------------------------------------//

  // const destChainId  = "421614";
  // const tokenAmount = ethers.BigNumber.from("10000000000000000000"); //50k * 10^18
  // const destSwapTokenIndexFrom = 3; // FIXED
  // const destSwapTokenIndexTo = 1;
  // const destMinDy = await calculateMinDyForSwap(
  //     destChainId,
  //     destSwapTokenIndexFrom,
  //     destSwapTokenIndexTo,
  //     tokenAmount
  // );

  // await approvalAddcUSDToZapL2ToL2(networkChainId, caller, tokenAmount);
  // console.log("Token approved...........")

  // const values = await cUSDToStableFromL1ToL2(
  //   networkChainId, 
  //   caller, 
  //   destChainId, 
  //   tokenAmount,
  //   destSwapTokenIndexFrom,
  //   destSwapTokenIndexTo,
  //   destMinDy
  //   );
  // console.log(values);

  //--------------- cUSDTocUSDFromL2ToL2 (use cUSDTocUSDFromL1ToL2) --------------------------------------//

  // const destChainId  = "11155420";
  // const tokenAmount = ethers.BigNumber.from("10000000000000000000"); //50k * 10^18

  // await approvalAddcUSDToZapL2ToL2(networkChainId, caller, tokenAmount);
  // console.log("Token approved...........")

  // const values = await cUSDTocUSDFromL1ToL2(
  //   networkChainId, 
  //   caller, 
  //   destChainId, 
  //   tokenAmount
  //   );
  // console.log(values);

    //--------------- Calculate MinToMint(AddLiquidity) --------------------------------------//
    
    // const token0Amount = ethers.BigNumber.from("50000000000000000000000"); //50k * 10^18
    // const token1Amount = ethers.BigNumber.from("50000000000"); //50k * 10^6
    // const token2Amount = ethers.BigNumber.from("50000000000"); //50k * 10^6
    // const token3Amount = ethers.BigNumber.from("50000000000000000000000"); //50k * 10^18
    // let amountsToAdd;
    // if(networkChainId == "11155111"){
    //   amountsToAdd = [token0Amount, token1Amount, token2Amount];
    // }
    // else{
    //   amountsToAdd = [token0Amount, token1Amount, token2Amount, token3Amount];
    // }
    // const isDeposit = true;
    // console.log("Calculation in progress...");
    // const calculatedMinToMintWithSlippage = await calculateMinToMintForAddLiquidity(
    //     networkChainId,
    //     amountsToAdd,
    //     isDeposit
    // );
    
    // await approvalAddLiquidityToStablePool(networkChainId, caller, amountsToAdd);
    // console.log("Tokens approved...........")

    // // --------------- Add Liquidity --------------------------------------//

    // const deadLine = ethers.BigNumber.from("100000000000000000000000000");

    // const mintedLPTokens = await addLiquidityToStablePool(
    //     networkChainId,
    //     caller,
    //     amountsToAdd,
    //     calculatedMinToMintWithSlippage,
    //     deadLine
    // )

    // console.log("Minted LP tokens for adding liquidity...", ethers.utils.formatUnits(mintedLPTokens));

    //--------------- Calculate minAmounts(RemoveLiquidity) --------------------------------------//

    // const lpTokenToBurn = ethers.BigNumber.from("10000000000000000000000"); //10k * 10^18
    // console.log("Calculation in progress...");
    // const calculatedMinAmountsToReceive = await calculateMinAmountsForRemoveLiquidity(networkChainId, lpTokenToBurn);
    
    // await approvalRemoveLiquidityFromStablePool(networkChainId, caller, lpTokenToBurn);
    // console.log("Tokens approved for burn...........")

    // // --------------- Remove Liquidity --------------------------------------//

    // const deadLine = ethers.BigNumber.from("100000000000000000000000000");

    // const amountsReceived = await removeLiquidityFromStablePool(
    //     networkChainId,
    //     caller,
    //     calculatedMinAmountsToReceive,
    //     lpTokenToBurn,
    //     deadLine
    // )

    // console.log("Received amounts of tokens for removing liquidity...", amountsReceived);

    //--------------- Calculate MinDy(Swap) --------------------------------------//

    // const fromTokenIndex = 1;
    // const toTokenIndex = 2;
    // const amountDx = ethers.BigNumber.from("50000000"); // 50 * 10^6 USDC to USDT
    // console.log("Calculation in progress...");
    // const calculatedMinDy= await calculateMinDyForSwap(
    //     networkChainId,
    //     fromTokenIndex,
    //     toTokenIndex,
    //     amountDx
    // );
    
    // await approvalSwapUsingStablePool(networkChainId, caller, fromTokenIndex, amountDx);
    // console.log("Tokens approved for Swap...........")

    // // --------------- Swap --------------------------------------//

    // const deadLine = ethers.BigNumber.from("100000000000000000000000000");
    // const swappedTokens = await swapUsingStablePool(
    //     networkChainId,
    //     caller,
    //     fromTokenIndex,
    //     toTokenIndex,
    //     amountDx,
    //     calculatedMinDy, 
    //     deadLine
    // );
    // console.log("Received amount of swapped tokens...", ethers.utils.formatUnits(swappedTokens));

    //--------------- Calculate AmountForMinAmounts(RemoveLiquidity) --------------------------------------//

    // const token0Amount = ethers.BigNumber.from("73306548170601083813");
    // const token1Amount = ethers.BigNumber.from("1498001907");
    // const token2Amount = ethers.BigNumber.from("91461889");
    // const minAmountsToRemove = [token0Amount, token1Amount, token2Amount];
    // const isDeposit = false;
    // console.log("Calculation in progress...");
    // const calculatedMinToMintWithSlippage = await calculateMinToMintForAddLiquidity(
    //   minAmountsToRemove,
    //     isDeposit
    // );
    // console.log("AmountForMinAmounts for removing this liquidity...", calculatedMinToMintWithSlippage);

 }

 main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });