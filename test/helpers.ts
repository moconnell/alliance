import {
  Contract,
  ContractReceipt,
  ContractTransaction,
  Signer } from "ethers";
import { ethers } from "hardhat";
import chai from "chai";

const cal1Config = {
  emailAddress : "alice@mail.com",
  availableDays : [true, true, true, true, true, false, false],
  startTime : [9, 30], // 9:30 UTC
  endTime : [16, 30], // 16:30 UTC
}

const cal2Config = {
  emailAddress : "bob@mail.com",
  availableDays : [true, true, true, true, true, false, false],
  startTime : [8, 0], //  8:00 UTC
  endTime : [16, 30], // 16:30 UTC
}

async function prepareCalendarFactory(deployer: Signer) {
  // deploy CalendarLib
  const CalendarLib = await ethers.getContractFactory("CalendarLib");
  let calendarLib = await CalendarLib.deploy();

  // deploy CalendarFactory
  const CalendarFactory = await ethers.getContractFactory("CalendarFactory", {
    libraries: {
      CalendarLib: calendarLib.address
    } });

  return [await CalendarFactory.deploy(), calendarLib];
}

async function prepareCalendar(calendarFactory: Contract, signer: Signer, config: Object) {

  let tx: ContractTransaction = await calendarFactory.connect(signer).createCalendar(
    ...Object.values(config)
  );
  let receipt: ContractReceipt = await tx.wait();
  const txEvent = receipt.events?.[0]?.args;
  let userAddress = txEvent?.userAddress;
  let calenderAddress = txEvent?.calenderAddress;
  let id = txEvent?.id;

  chai.expect(userAddress).to.equal(await signer.getAddress());
  const calendarAddressFromMapping = await calendarFactory.calendarIdToCalendar(id);
  chai.expect(calenderAddress).to.equal(calendarAddressFromMapping);

  return [await ethers.getContractAt("Calendar", calenderAddress), id];
}

export {
  cal1Config,
  cal2Config,
  prepareCalendarFactory,
  prepareCalendar
}