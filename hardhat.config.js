/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY } = process.env;
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
    goerli: {
      url: "https://goerli.infura.io/v3/95587b7d880c4232ab0905798ef84865",
      accounts: [
        `0xf68f478fee7dec62a51059284f0ac08ffe863e3da5dc5d04c47809c3752fd80f`,
      ],
    },
  },
};
