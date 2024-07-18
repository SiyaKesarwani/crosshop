const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const {
  asyncForEach,
  getCurrentBlockTimestamp,
  getPoolBalances,
  MAX_UINT256,
  ZERO_ADDRESS,
} = require("../utils/testUtils")

describe('Bridge from L1 chain To L2 chain', () => {
  let L1_swap;
  let L2_swap;
  let L1_swapToken;
  let owner;
  let ownerAddress;
  let nodeGroup;
  let nodeGroupAddress;
  let L1_DAI;
  let L2_DAI;
  let L1_USDC;
  let L2_USDC;
  let L1_USDT;
  let L2_USDT;
  let L1_WETH;
  let L2_WETH;
  let cUSD;
  let L1_crossHop;
  let L2_crossHop;
  let L1_L1BridgeZap;
  let L2_L1BridgeZap;
  let L2BridgeZap;

  async function setupTestL1(){
    // Test Values
    const INITIAL_A_VALUE = 50;
    const SWAP_FEE = 1e7;
    const L1_LP_TOKEN_NAME = "crossHop USD";
    const L1_LP_TOKEN_SYMBOL = "cUSD";
    const L1_TOKENS = [];
  
    // Deploy dummy tokens
    const erc20Factory = await ethers.getContractFactory("GenericERC20");

    const swapUtilsArti = await ethers.getContractFactory("SwapUtils");
  
    L1_DAI = (await erc20Factory.deploy("DAI", "DAI", "18"));
    L1_USDC = (await erc20Factory.deploy("USDC", "USDC", "6"));
    L1_USDT = (await erc20Factory.deploy("USDT", "USDT", "6"));
    L1_WETH = (await erc20Factory.deploy("WETH", "WETH", "18"));
  
    L1_TOKENS.push(L1_DAI, L1_USDC, L1_USDT);
  
    await L1_DAI.mint(ownerAddress, String(1e20));
    await L1_USDC.mint(ownerAddress, String(1e8));
    await L1_USDT.mint(ownerAddress, String(1e8));
  
    // Deploy dummy SwapUtils
    let swapUtils = await swapUtilsArti.deploy();
    await swapUtils.deployed();
  
    // Deploy dummy AmplificationUtils
    const amplificationUtilsArti = await ethers.getContractFactory("AmplificationUtils");
    let amplificationUtils = await amplificationUtilsArti.deploy();
    await amplificationUtils.deployed();
  
    // Deploy Swap with SwapUtils & AmplificationUtils library
    const swapFactory = await ethers.getContractFactory("Swap", {
      libraries: {
        SwapUtils: swapUtils.address,
        AmplificationUtils: amplificationUtils.address,
      },
    });
    L1_swap = (await swapFactory.deploy());

    // Deploy dummy lpToken
    const lpTokenArti = await ethers.getContractFactory("LPToken");
    let lpToken = await lpTokenArti.deploy();
    await lpToken.deployed();
  
    await L1_swap.initialize(
      [L1_DAI.address, L1_USDC.address, L1_USDT.address],
      [18, 6, 6],
      L1_LP_TOKEN_NAME,
      L1_LP_TOKEN_SYMBOL,
      INITIAL_A_VALUE,
      SWAP_FEE,
      0,
      lpToken.address
    );
  
    const swapStorage = await L1_swap.swapStorage();
  
    L1_swapToken = (await ethers.getContractAt("LPToken", swapStorage.lpToken));
  
    await L1_DAI.connect(owner).approve(L1_swap.address, MAX_UINT256);
    await L1_USDC.connect(owner).approve(L1_swap.address, MAX_UINT256);
    await L1_USDT.connect(owner).approve(L1_swap.address, MAX_UINT256);
  
    // Populate the pool with initial liquidity
    await L1_swap.addLiquidity(
      [String(50e18), String(50e6), String(50e6)],
      0,
      MAX_UINT256
    );

    // Verify swapToken balance
    expect(await L1_swapToken.balanceOf(ownerAddress)).to.be.eq(String(150e18));
  
    const crossHopFactory = await ethers.getContractFactory('CrossHop');
    L1_crossHop = await crossHopFactory.deploy();
    await L1_crossHop.deployed();
    await L1_crossHop.connect(owner).initialize();
  
    // Give NODEGROUP_ROLE to nodeGroupAddress
    await L1_crossHop.connect(owner).grantRole(L1_crossHop.NODEGROUP_ROLE(), nodeGroupAddress);
  
    const L1BridgeZapFactory = await ethers.getContractFactory('L1BridgeZap');
    L1_L1BridgeZap = await L1BridgeZapFactory.deploy(
      L1_WETH.address, 
      L1_swap.address, 
      L1_crossHop.address);
    await L1_L1BridgeZap.deployed();
  
    // Approve all tokens to L1Zap for calling different functions
    await L1_DAI.connect(owner).approve(L1_L1BridgeZap.address, MAX_UINT256);
    await L1_USDC.connect(owner).approve(L1_L1BridgeZap.address, MAX_UINT256);
    await L1_USDT.connect(owner).approve(L1_L1BridgeZap.address, MAX_UINT256);
    await L1_swapToken.connect(owner).approve(L1_L1BridgeZap.address, MAX_UINT256);
  }

  async function setupTestL2(){
    // Test Values
    const INITIAL_A_VALUE = 50;
    const SWAP_FEE = 1e7;
    const L2_LP_TOKEN_NAME = "TestToken LP Token";
    const L2_LP_TOKEN_SYMBOL = "TLT";
    const L2_TOKENS = [];
  
    // Deploy dummy tokens
    const erc20Factory = await ethers.getContractFactory("GenericERC20");
    const lpTokenArti = await ethers.getContractFactory("LPToken");

    const swapUtilsArti = await ethers.getContractFactory("SwapUtils");
  
    L2_DAI = (await erc20Factory.deploy("DAI", "DAI", "18"));
    L2_USDC = (await erc20Factory.deploy("USDC", "USDC", "6"));
    L2_USDT = (await erc20Factory.deploy("USDT", "USDT", "6"));
    L2_WETH = (await erc20Factory.deploy("WETH", "WETH", "18"));
    cUSD = (await lpTokenArti.deploy());
    cUSD.connect(owner).initialize("CrossHop USD", "cUSD")
  
    L2_TOKENS.push(L2_DAI, L2_USDC, L2_USDT, cUSD);
  
    await L2_DAI.mint(ownerAddress, String(100e18));
    await L2_USDC.mint(ownerAddress, String(1e8));
    await L2_USDT.mint(ownerAddress, String(1e8));
    await cUSD.mint(ownerAddress, String(100e18));
  
    // Deploy dummy SwapUtils
    let L2SwapUtils = await swapUtilsArti.deploy();
    await L2SwapUtils.deployed();
  
    // Deploy dummy AmplificationUtilsAmplificationUtils
    const amplificationUtilsArti = await ethers.getContractFactory("AmplificationUtils");
    let L2AmplificationUtils = await amplificationUtilsArti.deploy();
    await L2AmplificationUtils.deployed();
  
    // Deploy Swap with SwapUtils & AmplificationUtils library
    const L2SwapFactory = await ethers.getContractFactory("Swap", {
      libraries: {
        SwapUtils: L2SwapUtils.address,
        AmplificationUtils: L2AmplificationUtils.address,
      },
    });
    L2_swap = (await L2SwapFactory.deploy());
  
    // Deploy dummy lpToken
    let L2LpToken = await lpTokenArti.deploy();
    await L2LpToken.deployed();
  
    await L2_swap.initialize(
      [L2_DAI.address, L2_USDC.address, L2_USDT.address, cUSD.address],
      [18, 6, 6, 18],
      L2_LP_TOKEN_NAME,
      L2_LP_TOKEN_SYMBOL,
      INITIAL_A_VALUE,
      SWAP_FEE,
      0,
      L2LpToken.address
    );
  
    L2SwapStorage = await L2_swap.swapStorage();
  
    await L2_DAI.connect(owner).approve(L2_swap.address, MAX_UINT256);
    await L2_USDC.connect(owner).approve(L2_swap.address, MAX_UINT256);
    await L2_USDT.connect(owner).approve(L2_swap.address, MAX_UINT256);
    await cUSD.connect(owner).approve(L2_swap.address, MAX_UINT256);
  
    // Populate the pool with initial liquidity
    await L2_swap.connect(owner).addLiquidity(
      [String(50e18), String(50e6), String(50e6), String(50e18)],
      0,
      MAX_UINT256
    );
  
    const crossHopFactory = await ethers.getContractFactory('CrossHop');
    L2_crossHop = await crossHopFactory.connect(owner).deploy();
    await L2_crossHop.deployed();
    await L2_crossHop.connect(owner).initialize();
  
    // Give minter role of cUSD to crossHop
    await cUSD.connect(owner).transferOwnership(L2_crossHop.address);
  
    // Give NODEGROUP_ROLE to nodeGroupAddress
    await L2_crossHop.connect(owner).grantRole(L2_crossHop.NODEGROUP_ROLE(), nodeGroupAddress);
  
    const L1BridgeZapFactory = await ethers.getContractFactory('L1BridgeZap');
    L2_L1BridgeZap = await L1BridgeZapFactory.deploy(
      L2_WETH.address, 
      L2_swap.address, 
      L2_crossHop.address);
    await L2_L1BridgeZap.deployed();
  
    const L2BridgeZapFactory = await ethers.getContractFactory('L2BridgeZap');
    L2BridgeZap = await L2BridgeZapFactory.deploy(
      L2_WETH.address, 
      L2_swap.address, 
      cUSD.address,
      ZERO_ADDRESS,
      ZERO_ADDRESS,
      L2_crossHop.address);
    await L2BridgeZap.deployed();
  
    await asyncForEach([L2_L1BridgeZap.address, L2BridgeZap.address], async (zap) => {
      await L2_DAI.connect(owner).approve(zap, MAX_UINT256);
      await L2_USDC.connect(owner).approve(zap, MAX_UINT256);
      await L2_USDT.connect(owner).approve(zap, MAX_UINT256);
      await cUSD.connect(owner).approve(zap, MAX_UINT256);
    });
  }

  beforeEach(async function(){
    [owner, nodeGroup] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    nodeGroupAddress = await nodeGroup.getAddress();
    await setupTestL1();
    await setupTestL2();
  });

  describe('Stable to Stable using zapAndDepositAndSwap()', () => {
    const destSwapTokenIndexFrom = 3; // FIXED
    describe('DAI --> DAI', () => {
        const amountsToAdd = [String(1e18), 0, 0];
        const destSwapTokenIndexTo = 0;
        let minted_cUSD;
        let minDySwap;
        let destSwapDeadline;
        let L1txHash;
        it("L1 - StableSwap got DAI from Owner and minted correct amount of cUSD to CrossHop", async() => {
          const calculationForMinToMint = await L1_L1BridgeZap.calculateTokenAmount(
              amountsToAdd,
              true
          );
          const minToMintWithSlippage = calculationForMinToMint.mul(999).div(1000);
          const originLiqDeadline = (await getCurrentBlockTimestamp()) + 120;
          minDySwap = await L2_swap.calculateSwap(
              destSwapTokenIndexFrom,
              destSwapTokenIndexTo,
              minToMintWithSlippage
          );
          destSwapDeadline = (await getCurrentBlockTimestamp()) + 30000;
          const tx = await L1_L1BridgeZap.connect(owner).zapAndDepositAndSwap(
              ownerAddress,
              network.config.chainId,
              L1_swapToken.address,
              amountsToAdd,
              minToMintWithSlippage,
              originLiqDeadline,
              destSwapTokenIndexFrom,
              destSwapTokenIndexTo,
              minDySwap,
              destSwapDeadline
          );

          var txReceipt = await(await tx.wait());
          L1txHash = await txReceipt.transactionHash;

          expect(await L1_DAI.balanceOf(ownerAddress)).to.be.eq(String(49e18));
          // Check current pool balances
          finalPoolBalances = await getPoolBalances(L1_swap, 3);
          expect(finalPoolBalances[0]).to.be.eq(String(51e18));
          expect(finalPoolBalances[1]).to.be.eq(String(50e6));
          expect(finalPoolBalances[2]).to.be.eq(String(50e6));
          minted_cUSD = "999372719469546181";
          expect(await L1_swapToken.balanceOf(L1_crossHop.address)).to.be.eq(minted_cUSD);
        });
        it("L2 - NodeGroup calls mintAndSwap() on CrossHop and transfer correct DAI to Owner", async() => {
          let fee = 0;
          let kappa = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(L1txHash));
          await L2_crossHop.connect(nodeGroup).mintAndSwap(
              ownerAddress,
              cUSD.address,
              minted_cUSD,
              fee,                      
              L2_swap.address,
              destSwapTokenIndexFrom,
              destSwapTokenIndexTo,
              minDySwap,
              destSwapDeadline,
              kappa
          );
          swappedAmount = "997982076543851214"
          expect(await L2_DAI.balanceOf(ownerAddress)).to.be.eq(BigInt(String(50e18))+BigInt(swappedAmount));
          // Check current pool balances
          finalPoolBalances = await getPoolBalances(L2_swap, 4);
          expect(finalPoolBalances[0]).to.be.eq(BigInt(String(50e18))-BigInt(swappedAmount));
          expect(finalPoolBalances[1]).to.be.eq(String(50e6));
          expect(finalPoolBalances[2]).to.be.eq(String(50e6));
          expect(finalPoolBalances[3]).to.be.eq(BigInt(String(50e18))+BigInt(minted_cUSD));
        });
    });
    describe('USDT --> USDC', () => {
        const amountsToAdd = [0, 0, String(1e6)];
        const destSwapTokenIndexTo = 1;
        let minted_cUSD;
        let minDySwap;
        let destSwapDeadline;
        let L1txHash;
        it("L1 - StableSwap got USDT from Owner and minted correct amount of cUSD to CrossHop", async() => {
          const calculationForMinToMint = await L1_L1BridgeZap.calculateTokenAmount(
              amountsToAdd,
              true
          );
          const minToMintWithSlippage = calculationForMinToMint.mul(999).div(1000);
          const originLiqDeadline = (await getCurrentBlockTimestamp()) + 120;
          minDySwap = await L2_swap.calculateSwap(
              destSwapTokenIndexFrom,
              destSwapTokenIndexTo,
              minToMintWithSlippage
          );
          destSwapDeadline = (await getCurrentBlockTimestamp()) + 30000;
          const tx = await L1_L1BridgeZap.connect(owner).zapAndDepositAndSwap(
              ownerAddress,
              network.config.chainId,
              L1_swapToken.address,
              amountsToAdd,
              minToMintWithSlippage,
              originLiqDeadline,
              destSwapTokenIndexFrom,
              destSwapTokenIndexTo,
              minDySwap,
              destSwapDeadline
          );

          var txReceipt = await(await tx.wait());
          L1txHash = await txReceipt.transactionHash;

          expect(await L1_USDT.balanceOf(ownerAddress)).to.be.eq(String(49e6));
          // Check current pool balances
          finalPoolBalances = await getPoolBalances(L1_swap, 3);
          expect(finalPoolBalances[0]).to.be.eq(String(50e18));
          expect(finalPoolBalances[1]).to.be.eq(String(50e6));
          expect(finalPoolBalances[2]).to.be.eq(String(51e6));
          minted_cUSD = "999371751661740701";
          expect(await L1_swapToken.balanceOf(L1_crossHop.address)).to.be.eq(minted_cUSD);
        });
        it("L2 - NodeGroup calls mintAndSwap() on CrossHop and transfer correct USDC to Owner", async() => {
          let fee = 0;
          let kappa = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(L1txHash));
          await L2_crossHop.connect(nodeGroup).mintAndSwap(
              ownerAddress,
              cUSD.address,
              minted_cUSD,
              fee,                      
              L2_swap.address,
              destSwapTokenIndexFrom,
              destSwapTokenIndexTo,
              minDySwap,
              destSwapDeadline,
              kappa
          );
          swappedAmount = "997981"
          expect(await L2_USDC.balanceOf(ownerAddress)).to.be.eq(BigInt(String(50e6))+BigInt(swappedAmount));
          // Check current pool balances
          finalPoolBalances = await getPoolBalances(L2_swap, 4);
          expect(finalPoolBalances[0]).to.be.eq(String(50e18));
          expect(finalPoolBalances[1]).to.be.eq(BigInt(String(50e6))-BigInt(swappedAmount));
          expect(finalPoolBalances[2]).to.be.eq(String(50e6));
          expect(finalPoolBalances[3]).to.be.eq(BigInt(String(50e18))+BigInt(minted_cUSD));
        });
    });
    describe('DAI + USDC --> USDT', () => {
        const amountsToAdd = [String(1e18), String(1e6), 0];
        const destSwapTokenIndexTo = 2;
        let minted_cUSD;
        let minDySwap;
        let destSwapDeadline;
        let L1txHash;
        it("L1 - StableSwap got DAI+USDC from Owner and minted correct amount of cUSD to CrossHop", async() => {
          const calculationForMinToMint = await L1_L1BridgeZap.calculateTokenAmount(
              amountsToAdd,
              true
          );
          const minToMintWithSlippage = calculationForMinToMint.mul(999).div(1000);
          const originLiqDeadline = (await getCurrentBlockTimestamp()) + 120;
          minDySwap = await L2_swap.calculateSwap(
              destSwapTokenIndexFrom,
              destSwapTokenIndexTo,
              minToMintWithSlippage
          );
          destSwapDeadline = (await getCurrentBlockTimestamp()) + 30000;
          const tx = await L1_L1BridgeZap.connect(owner).zapAndDepositAndSwap(
              ownerAddress,
              network.config.chainId,
              L1_swapToken.address,
              amountsToAdd,
              minToMintWithSlippage,
              originLiqDeadline,
              destSwapTokenIndexFrom,
              destSwapTokenIndexTo,
              minDySwap,
              destSwapDeadline
          );

          var txReceipt = await(await tx.wait());
          L1txHash = await txReceipt.transactionHash;

          expect(await L1_DAI.balanceOf(ownerAddress)).to.be.eq(String(49e18));
          expect(await L1_USDC.balanceOf(ownerAddress)).to.be.eq(String(49e6));
          // Check current pool balances
          finalPoolBalances = await getPoolBalances(L1_swap, 3);
          expect(finalPoolBalances[0]).to.be.eq(String(51e18));
          expect(finalPoolBalances[1]).to.be.eq(String(51e6));
          expect(finalPoolBalances[2]).to.be.eq(String(50e6));
          minted_cUSD = "1999371369949471213";
          expect(await L1_swapToken.balanceOf(L1_crossHop.address)).to.be.eq(minted_cUSD);
        });
        it("L2 - NodeGroup calls mintAndSwap() on CrossHop and transfer correct USDT to Owner", async() => {
          let fee = 0;
          let kappa = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(L1txHash));
          await L2_crossHop.connect(nodeGroup).mintAndSwap(
              ownerAddress,
              cUSD.address,
              minted_cUSD,
              fee,                      
              L2_swap.address,
              destSwapTokenIndexFrom,
              destSwapTokenIndexTo,
              minDySwap,
              destSwapDeadline,
              kappa
          );
          swappedAmount = "1995804"
          expect(await L2_USDT.balanceOf(ownerAddress)).to.be.eq(BigInt(String(50e6))+BigInt(swappedAmount));
          // Check current pool balances
          finalPoolBalances = await getPoolBalances(L2_swap, 4);
          expect(finalPoolBalances[0]).to.be.eq(String(50e18));
          expect(finalPoolBalances[1]).to.be.eq(String(50e6));
          expect(finalPoolBalances[2]).to.be.eq(BigInt(String(50e6))-BigInt(swappedAmount));
          expect(finalPoolBalances[3]).to.be.eq(BigInt(String(50e18))+BigInt(minted_cUSD));
        });
    });
  });
  describe('Stable to cUSD using zapAndDeposit()', () => {
    let minted_cUSD;
    let L1txHash;
    it("L1 - StableSwap got DAI from Owner and minted correct amount of cUSD to CrossHop", async() => {
      const amountsToAdd = [String(1e18), 0, 0];
      const calculationForMinToMint = await L1_L1BridgeZap.calculateTokenAmount(
          amountsToAdd,
          true
      );
      const minToMintWithSlippage = calculationForMinToMint.mul(999).div(1000);
      const originLiqDeadline = (await getCurrentBlockTimestamp()) + 120;
      const tx = await L1_L1BridgeZap.connect(owner).zapAndDeposit(
          ownerAddress,
          network.config.chainId,
          L1_swapToken.address,
          amountsToAdd,
          minToMintWithSlippage,
          originLiqDeadline
      );

      var txReceipt = await(await tx.wait());
      L1txHash = await txReceipt.transactionHash;

      expect(await L1_DAI.balanceOf(ownerAddress)).to.be.eq(String(49e18));
      // Check current pool balances
      finalPoolBalances = await getPoolBalances(L1_swap, 3);
      expect(finalPoolBalances[0]).to.be.eq(String(51e18));
      expect(finalPoolBalances[1]).to.be.eq(String(50e6));
      expect(finalPoolBalances[2]).to.be.eq(String(50e6));
      expect(await L1_swapToken.balanceOf(L1_crossHop.address)).gt(minToMintWithSlippage);
      minted_cUSD = "999372719469546181";
      expect(await L1_swapToken.balanceOf(L1_crossHop.address)).to.be.eq(minted_cUSD);
    });
    it("L2 - NodeGroup calls mint() on CrossHop and mints correct cUSD to Owner", async() => {
      let fee = 0;
      let kappa = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(L1txHash));
      await L2_crossHop.connect(nodeGroup).mint(
          ownerAddress,
          cUSD.address,
          minted_cUSD,
          fee,
          kappa
      );
      expect(await cUSD.balanceOf(ownerAddress)).to.be.eq(BigInt(String(50e18))+BigInt(minted_cUSD));
      // Check current pool balances
      finalPoolBalances = await getPoolBalances(L2_swap, 4);
      expect(finalPoolBalances[0]).to.be.eq(String(50e18));
      expect(finalPoolBalances[1]).to.be.eq(String(50e6));
      expect(finalPoolBalances[2]).to.be.eq(String(50e6));
      expect(finalPoolBalances[3]).to.be.eq(String(50e18));
    });
  });
  describe('cUSD to Stable using depositAndSwap()', () => {
    const destSwapTokenIndexFrom = 3; // FIXED
    const destSwapTokenIndexTo = 1;
    let L1txHash;
    let cUSDAmount;
    let minDySwap;
    let destSwapDeadline;
    it("L1 - StableSwap got cUSD from Owner and deposit it correctly to CrossHop", async() => {
      cUSDAmount = String(1e18);
      minDySwap = await L2_swap.calculateSwap(
          destSwapTokenIndexFrom,
          destSwapTokenIndexTo,
          cUSDAmount
      );
      destSwapDeadline = (await getCurrentBlockTimestamp()) + 30000;
      const tx = await L1_L1BridgeZap.connect(owner).depositAndSwap(
          ownerAddress,
          network.config.chainId,
          L1_swapToken.address,
          cUSDAmount,
          destSwapTokenIndexFrom,
          destSwapTokenIndexTo,
          minDySwap,
          destSwapDeadline
      );

      var txReceipt = await(await tx.wait());
      L1txHash = await txReceipt.transactionHash;

      expect(await L1_swapToken.balanceOf(ownerAddress)).to.be.eq(String(149e18));
      expect(await L1_swapToken.balanceOf(L1_crossHop.address)).to.be.eq(cUSDAmount);
    });
    it("L2 - NodeGroup calls mintAndSwap() on CrossHop and transfer correct StableCoin to Owner", async() => {
      let fee = 0;
      let kappa = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(L1txHash));
      await L2_crossHop.connect(nodeGroup).mintAndSwap(
          ownerAddress,
          cUSD.address,
          cUSDAmount,
          fee,                      
          L2_swap.address,
          destSwapTokenIndexFrom,
          destSwapTokenIndexTo,
          minDySwap,
          destSwapDeadline,
          kappa
      );
      expect(await L2_USDC.balanceOf(ownerAddress)).gt(String(50e6));
      swappedAmount = "998608"
      expect(await L2_USDC.balanceOf(ownerAddress)).to.be.eq(BigInt(String(50e6))+BigInt(swappedAmount));
      // Check current pool balances
      finalPoolBalances = await getPoolBalances(L2_swap, 4);
      expect(finalPoolBalances[0]).to.be.eq(String(50e18));
      expect(finalPoolBalances[1]).to.be.eq(BigInt(String(50e6))-BigInt(swappedAmount));
      expect(finalPoolBalances[2]).to.be.eq(String(50e6));
      expect(finalPoolBalances[3]).to.be.eq(BigInt(String(50e18))+BigInt(cUSDAmount));
    });
  });
  describe('cUSD to cUSD using deposit()', () => {
    let cUSDAmount;
    let L1txHash;
    it("L1 - StableSwap got cUSD from Owner and deposit it correctly to CrossHop", async() => {
      cUSDAmount = String(100e18);
      const tx = await L1_L1BridgeZap.connect(owner).deposit(
          ownerAddress,
          network.config.chainId,
          L1_swapToken.address,
          cUSDAmount
      );

      var txReceipt = await(await tx.wait());
      L1txHash = await txReceipt.transactionHash;

      expect(await L1_swapToken.balanceOf(ownerAddress)).to.be.eq(String(50e18));
      expect(await L1_swapToken.balanceOf(L1_crossHop.address)).to.be.eq(cUSDAmount);
    });
    it("L2 - NodeGroup calls mint() on CrossHop and mints correct cUSD to Owner", async() => {
      let fee = 0;
      let kappa = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(L1txHash));
      await L2_crossHop.connect(nodeGroup).mint(
          ownerAddress,
          cUSD.address,
          cUSDAmount,
          fee,
          kappa
      );
      expect(await cUSD.balanceOf(ownerAddress)).to.be.eq(String(150e18));
      // Check current pool balances
      finalPoolBalances = await getPoolBalances(L2_swap, 4);
      expect(finalPoolBalances[0]).to.be.eq(String(50e18));
      expect(finalPoolBalances[1]).to.be.eq(String(50e6));
      expect(finalPoolBalances[2]).to.be.eq(String(50e6));
      expect(finalPoolBalances[3]).to.be.eq(String(50e18));
    });
  });
});