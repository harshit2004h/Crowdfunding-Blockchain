require("@matterlabs/hardhat-zksync-solc");
require("@matterlabs/hardhat-zksync-verify");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "sepolia", // Moved to root level
  zksolc: {
    version: "1.4.1",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    // zkSync Era Sepolia Testnet (Layer 2)
    zkSyncSepoliaTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia",
      zksync: true,
      chainId: 300,
      verifyURL: "https://explorer.sepolia.era.zksync.dev/contract_verification",
    },
    // zkSync Era Mainnet (Layer 2)
    zkSyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
      chainId: 324,
      verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
    },
    // Ethereum Sepolia Testnet (Layer 1)
    sepolia: {
      url: process.env.ANKR_RPC_URL || 'https://rpc.ankr.com/eth_sepolia',
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
      chainId: 11155111,
    },
    // Local Hardhat network
    hardhat: {},
  },
  paths: {
    artifacts: "./artifacts-zk",
    cache: "./cache-zk",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};