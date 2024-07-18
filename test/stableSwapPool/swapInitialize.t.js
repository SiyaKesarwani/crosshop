const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  ZERO_ADDRESS
} = require("../utils/testUtils")

describe("Swap", () => {
    let signers;
    let firstToken;
    let secondToken;
    let owner;
    let swapUtils;
    let amplificationUtils;
    let lpToken;
  
    // Test Values
    const INITIAL_A_VALUE = 50;
    const SWAP_FEE = 1e7;
    const LP_TOKEN_NAME = "Test LP Token Name";
    const LP_TOKEN_SYMBOL = "TESTLP";
  
    async function setupTest() {
      signers = await ethers.getSigners();
      owner = signers[0];
  
      // Deploy dummy tokens
      const erc20Factory = await ethers.getContractFactory("GenericERC20");
  
      firstToken = (await erc20Factory.deploy("First Token", "FIRST", "18"));
  
      secondToken = (await erc20Factory.deploy("Second Token", "SECOND", "18"));

      // Deploy dummy SwapUtils
      const swapUtilsArti = await ethers.getContractFactory("SwapUtils");
      swapUtils = await swapUtilsArti.deploy();
      await swapUtils.deployed();

      // Deploy dummy AmplificationUtils
      const amplificationUtilsArti = await ethers.getContractFactory("AmplificationUtils");
      amplificationUtils = await amplificationUtilsArti.deploy();
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
      lpToken = await lpTokenArti.deploy();
      await lpToken.deployed();
    }

    beforeEach(async function(){
      await setupTest();
    });

    describe("swapStorage#constructor", () => {
      it("Reverts with '_pooledTokens.length <= 1'", async () => {
        await expect(
          swap.initialize(
            [],
            [18, 18],
            LP_TOKEN_NAME,
            LP_TOKEN_SYMBOL,
            INITIAL_A_VALUE,
            SWAP_FEE,
            0,
            lpToken.address
          )
        ).to.be.revertedWith("_pooledTokens.length <= 1");
      });
  
      it("Reverts with '_pooledTokens.length > 32'", async () => {
        await expect(
          swap.initialize(
            Array(33).fill(firstToken.address),
            [18, 18],
            LP_TOKEN_NAME,
            LP_TOKEN_SYMBOL,
            INITIAL_A_VALUE,
            SWAP_FEE,
            0,
            lpToken.address
          )
        ).to.be.revertedWith("_pooledTokens.length > 32");
      });
  
      it("Reverts with '_pooledTokens decimals mismatch'", async () => {
        await expect(
          swap.initialize(
            [firstToken.address, secondToken.address],
            [18],
            LP_TOKEN_NAME,
            LP_TOKEN_SYMBOL,
            INITIAL_A_VALUE,
            SWAP_FEE,
            0,
            lpToken.address
          )
        ).to.be.revertedWith("_pooledTokens decimals mismatch");
      });
  
      it("Reverts with 'Duplicate tokens'", async () => {
        await expect(
          swap.initialize(
            [firstToken.address, firstToken.address],
            [18, 18],
            LP_TOKEN_NAME,
            LP_TOKEN_SYMBOL,
            INITIAL_A_VALUE,
            SWAP_FEE,
            0,
            lpToken.address
          )
        ).to.be.revertedWith("Duplicate tokens");
      });
  
      it("Reverts with 'The 0 address isn't an ERC-20'", async () => {
        await expect(
          swap.initialize(
            [ZERO_ADDRESS, ZERO_ADDRESS],
            [18, 18],
            LP_TOKEN_NAME,
            LP_TOKEN_SYMBOL,
            INITIAL_A_VALUE,
            SWAP_FEE,
            0,
            lpToken.address
          )
        ).to.be.revertedWith("The 0 address isn't an ERC-20");
      });
  
      it("Reverts with 'Token decimals exceeds max'", async () => {
        await expect(
          swap.initialize(
            [firstToken.address, secondToken.address],
            [19, 18],
            LP_TOKEN_NAME,
            LP_TOKEN_SYMBOL,
            INITIAL_A_VALUE,
            SWAP_FEE,
            0,
            lpToken.address
          )
        ).to.be.revertedWith("Token decimals exceeds max");
      });
  
      it("Reverts with '_a exceeds maximum'", async () => {
        await expect(
          swap.initialize(
            [firstToken.address, secondToken.address],
            [18, 18],
            LP_TOKEN_NAME,
            LP_TOKEN_SYMBOL,
            10e6 + 1,
            SWAP_FEE,
            0,
            lpToken.address
          )
        ).to.be.revertedWith("_a exceeds maximum");
      });
  
      it("Reverts with '_fee exceeds maximum'", async () => {
        await expect(
          swap.initialize(
            [firstToken.address, secondToken.address],
            [18, 18],
            LP_TOKEN_NAME,
            LP_TOKEN_SYMBOL,
            INITIAL_A_VALUE,
            10e8 + 1,
            0,
            lpToken.address
          )
        ).to.be.revertedWith("_fee exceeds maximum");
      });
  
      it("Reverts with '_adminFee exceeds maximum'", async () => {
        await expect(
          swap.initialize(
            [firstToken.address, secondToken.address],
            [18, 18],
            LP_TOKEN_NAME,
            LP_TOKEN_SYMBOL,
            INITIAL_A_VALUE,
            SWAP_FEE,
            10e10 + 1,
            lpToken.address
          )
        ).to.be.revertedWith("_adminFee exceeds maximum");
      });
  
      it("Reverts when the LPToken target does not implement initialize function", async () => {
        await expect(
          swap.initialize(
            [firstToken.address, secondToken.address],
            [18, 18],
            LP_TOKEN_NAME,
            LP_TOKEN_SYMBOL,
            INITIAL_A_VALUE,
            SWAP_FEE,
            0,
            ZERO_ADDRESS
          )
        ).to.be.reverted;
      });
    });  
})