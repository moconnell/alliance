// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { ethers } from "hardhat";
import { deployCalendarFactory } from "test/helpers";
import { writeFile } from "fs/promises";

const main = async () => {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  console.log("Deploying contracts with the account:", deployer.address);

  const calendarFactory = await deployCalendarFactory(deployer);

  console.log("CalendarFactory deployed to:", calendarFactory.address);

  await writeFile(".accounts", accounts.map(x => x.address).join("\n"));
  await writeFile(".contract", calendarFactory.address);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
