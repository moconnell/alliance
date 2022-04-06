// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { ethers } from "hardhat";

const deployContract = async (name: string) => {
  try {
    console.log(`${name}: starting deployment`);

    const fac = await ethers.getContractFactory(name);
    console.log(`${name}: got contract factory`);

    const contract = await fac.deploy();
    console.log(`${name}: deployment in progress`);

    await contract.deployed();
    console.log(`${name}: deployed to ${contract.address}`);
  } catch (error) {
    console.error(`${name}: error`);
  }
};

const main = async () => {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // const contracts = ["Calendar"];
  // contracts.forEach(async (name) => {
  const name = "Calendar";
  console.log(`${name}: starting deployment`);

  const fac = await ethers.getContractFactory(name);
  console.log(`${name}: got contract factory`);

  const contract = await fac.deploy();
  console.log(`${name}: deployment in progress`);

  await contract.deployed();
  console.log(`${name}: deployed to ${contract.address}`);
  // });

  console.log("Deployment finished");
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
