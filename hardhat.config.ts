import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "tsconfig-paths/register";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { task } from "hardhat/config";

dotenv.config();

const { ROPSTEN_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("artefacts", "Prints the list of artefacts", async (args, hre) => {
  const reContract = /[a-z]+.sol/i;
  const artefactPaths = await hre.artifacts.getArtifactPaths();

  for (const artefactPath of artefactPaths) {
    const reExecArr = reContract.exec(artefactPath);
    if (reExecArr) {
      const contractName = reExecArr.pop();
      if (contractName) {
        console.log(artefactPath, contractName);
        try {
          const artefact = await hre.artifacts.readArtifact(contractName);
          console.log(artefact);          
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  networks: {
    localhost: {},
    ropsten: {
      url: ROPSTEN_URL,
    },
  },
  solidity: "0.8.9", // latest supported as of 2022-05-04, see https://hardhat.org/reference/solidity-support.html
};

export default config;
