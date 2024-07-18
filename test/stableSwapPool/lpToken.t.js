const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const {
  asyncForEach,
  MAX_UINT256,
  ZERO_ADDRESS
} = require("../utils/testUtils")

describe("LPToken", async () => {
  let signers;
  let owner;
  let firstToken;
  let lpTokenFactory;
  let TOKENS = [];
  let swap;
  let swapLPToken;
  
  async function setupTest() {
    // Test Values
    const INITIAL_A_VALUE = 50;
    const SWAP_FEE = 1e7;
    const LP_TOKEN_NAME = "Test LP Token Name";
    const LP_TOKEN_SYMBOL = "TESTLP";

    signers = await ethers.getSigners();
    owner = signers[0];
    lpTokenFactory = await ethers.getContractFactory("LPToken");

    const erc20Factory = await ethers.getContractFactory("GenericERC20");

    // Deploy dummy tokens
    let DAI = (await erc20Factory.deploy("DAI", "DAI", "18"));
    let USDC = (await erc20Factory.deploy("USDC", "USDC", "6"));
    let USDT = (await erc20Factory.deploy("USDT", "USDT", "6"));

    TOKENS.push(DAI, USDC, USDT);

    // Deploy dummy SwapUtils
    const swapUtilsArti = await ethers.getContractFactory("SwapUtils");
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
    swap = (await swapFactory.deploy());
  
    // Deploy dummy lpToken
    const lpTokenArti = await ethers.getContractFactory("LPToken");
    let lpToken = await lpTokenArti.deploy();
    await lpToken.deployed();

    await swap.initialize(
      [DAI.address, USDC.address, USDT.address],
      [18, 6, 6],
      LP_TOKEN_NAME,
      LP_TOKEN_SYMBOL,
      INITIAL_A_VALUE,
      SWAP_FEE,
      0,
      lpToken.address
    );
  
    swapStorage = await swap.swapStorage();

    swapLPToken = (await ethers.getContractAt("LPToken", swapStorage.lpToken));

  }

    beforeEach(async function(){
      await setupTest();
    });

    it("Reverts when minting 0", async () => {
        // Deploy dummy tokens
        firstToken = (await lpTokenFactory.deploy());
        firstToken.initialize("Test Token", "TEST");
        await expect(firstToken.mint(await owner.getAddress(), 0)).to.be.revertedWith(
          "LPToken: cannot mint 0"
        );
      });  
    
      it("Reverts when zero address is the new owner", async () => {
        // Deploy dummy tokens
        firstToken = (await lpTokenFactory.deploy());
        firstToken.initialize("Test Token", "TEST");
        await expect(firstToken.transferOwnership(ZERO_ADDRESS)).to.be.revertedWith(
          "Ownable: new owner is the zero address"
        );
      });
    
      it("Reverts when transferring the token to itself", async () => {
        const ownerAddress = await owner.getAddress();
    
        await asyncForEach(TOKENS, async (token) => {
          await token.mint(
            ownerAddress,
            BigNumber.from(10)
              .pow(await token.decimals())
              .mul(1000)
          );
          await token.approve(swap.address, MAX_UINT256);
        });
    
        await swap.addLiquidity([String(100e18), String(100e6), String(100e6)], 0, MAX_UINT256);
    
        // Verify current balance
        expect(await swapLPToken.balanceOf(ownerAddress)).to.eq(String(300e18));
    
        // Transferring LPToken to itself should revert
        await expect(swapLPToken.transfer(swapLPToken.address, String(100e18))).to.be.revertedWith(
          "LPToken: cannot send to itself"
        );
      });
    
      it("Reverts when non-swap address tries to mint", async () => {
        const ownerAddress = await owner.getAddress();

        // Transferring LPToken to itself should revert
        await expect(swapLPToken.mint(ownerAddress, String(100e18))).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });      
})