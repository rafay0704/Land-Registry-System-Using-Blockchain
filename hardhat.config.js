require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {};

// const goerli_url=process.env.goerli_url
const polygon_url = process.env.polygon_url;
const private_key = process.env.private_key;
// console.warn(goerli_url)
module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        runs: 200,
        enabled: true,
      },
    },
  },

  networks: {
    MATIC_MUMBAI: {
      url: polygon_url,
      accounts: [private_key],
    },
  },
};
