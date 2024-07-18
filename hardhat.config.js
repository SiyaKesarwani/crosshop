require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    polygon: {
      url: process.env.POLYGON_API,
      chainId: 137,
      gasPrice: 400 * 1000000000,
      gas: 1000000,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY_1}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_2}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_3}`
                ],
    },
    mainnet: {
      url: process.env.MAINNET_API,
      chainId: 1,
      gasPrice: 400 * 1000000000,
      gas: 1000000,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY_1}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_2}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_3}`
                ],
    },
    optimism: {
      url: process.env.OPTIMISM_API,
      chainId: 10,
      gasPrice: 400 * 1000000000,
      gas: 1000000,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY_1}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_2}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_3}`
                ],
    },
    arbitrum: {
      url: process.env.ARBITRUM_API,
      chainId: 42161,
      gasPrice: 400 * 1000000000,
      gas: 1000000,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY_1}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_2}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_3}`
                ],
    },
    goerli: {
      url: process.env.GOERLI_API,
      chainId: 5,
      timeout: 1000000,
      allowUnlimitedContractSize: true,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY_1}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_2}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_3}`
                ],
    },
    sepolia: {
      chainId: 11155111,
      url: process.env.SEPOLIA_API,
      timeout: 1000000,
      allowUnlimitedContractSize: true,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY_1}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_2}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_3}`
                ],
    },
    arbiSepolia: {
      chainId: 421614,
      url: process.env.ARBI_SEPOLIA_API,
      timeout: 1000000,
      allowUnlimitedContractSize: true,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY_1}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_2}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_3}`
                ],
    },
    optiSepolia: {
      chainId: 11155420,
      url: process.env.OPTI_SEPOLIA_API,
      timeout: 1000000,
      allowUnlimitedContractSize: true,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY_1}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_2}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_3}`
                ],
    },
    amoy: {
      chainId: 80002,
      url: process.env.AMOY_API,
      timeout: 1000000,
      allowUnlimitedContractSize: true,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY_1}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_2}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_3}`
                ]
    },
    fuji: {
      url: process.env.SNOWTRACE_API,
      chainId: 43113,
      gasPrice: 400 * 1000000000,
      gas: 1000000,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY_1}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_2}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_3}`
                ],
    },
    fantomTestnet: {
      url: process.env.FANTOMTESTNET_API,
      chainId: 4002,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY_1}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_2}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_3}`
                ],
    },
    bnbTestnet: {
      url: process.env.BNBTESTNET_API,
      chainId: 97,
      gasPrice: 10000000000,
      timeout: 20000,
      allowUnlimitedContractSize: true,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY_1}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_2}`,
                 `0x${process.env.DEPLOYER_PRIVATE_KEY_3}`
                ],
    },
    hardhat: {
      forking: {
        url: process.env.MAINNET_API,
        blockNumber: 19475958,
      },
      chainId: 31337,
      gas: 12000000,
      accounts: {
          mnemonic: "test test test test test test test test test test test junk",
          count: 20
      }
    }
  },
  etherscan: {
    apiKey: {
      arbiSepolia: process.env.ARBISCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY,
      optiSepolia : process.env.OPTIMISM_API_KEY,
      amoy : process.env.PLOYGONSCAN_API_KEY,
      fuji: process.env.SNOWTRACE_API_KEY, // apiKey is not required, just set a placeholder
      fantomTestnet : process.env.FANTOMTESTNET_API_KEY,
      bnbTestnet : process.env.BNBTESTNET_API_KEY,
    },
    customChains: [
      {
        network: "fuji",
        chainId: 43113,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan",
          browserURL: "https://testnet.snowtrace.io"
        }
      },
      {
        network: "arbiSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/"
        }
      },
      {
        network: "optiSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://optimism-sepolia.blockscout.com/api",
          browserURL: "https://optimism-sepolia.blockscout.com/"
        }
      },
      {
        network: "amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com/"
        }
      },
      {
        network: "fantomTestnet",
        chainId: 4002,
        urls: {
          apiURL: "https://api-testnet.ftmscan.com/api",
          browserURL: "https://testnet.ftmscan.com/"
        }
      },
      {
        network: "bnbTestnet",
        chainId: 97,
        urls: {
          apiURL: "https://api-testnet.bscscan.com/api",
          browserURL: "https://testnet.bscscan.com/"
        }
      }
    ]
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            details: {
              yul: true,
              yulDetails: {
                stackAllocation: true,
                optimizerSteps: "u",
              },
            },
            runs: 10000,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            details: {
              yul: true,
              yulDetails: {
                stackAllocation: true,
                optimizerSteps: "u",
              },
            },
            runs: 10000,
          },
        },
      },
    ],
  }
};
