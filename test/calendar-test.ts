import { ethers } from "hardhat";
import {
  Contract,
  ContractTransaction,
  ContractReceipt,
  BigNumber,
  Signer
} from "ethers";
import chai, { expect } from "chai";

const alicesCalendarConfig = {
  timezone : 0, // UTC+0
  emailAddress : "alice@mail.com",
  availableDays : [true, true, true, true, true, false, false],
  startTime : [9, 30], // 9:30
  endTime : [16, 30], // 16:30
}

const bobsCalendarConfig = {
  timezone : +2, // UTC+2
  emailAddress : "bob@mail.com",
  availableDays : [true, true, true, true, true, false, false],
  startTime : [8, 0], // 8:00
  endTime : [16, 30], // 16:30
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


describe("CalendarFactory", function() {
  let calendarFactory: Contract;
  let cal1: Contract;
  let cal2: Contract;
  let signer1: Signer;
  let signer2: Signer;

  beforeEach(async function() {
    [signer1, signer2]  = await ethers.getSigners();

    [calendarFactory] = await prepareCalendarFactory(signer1);

    // deploy alice's calendar
    let cal1Id;
    [cal1, cal1Id] = await prepareCalendar(calendarFactory, signer1, alicesCalendarConfig);
    chai.expect(cal1Id).to.equal(0);

    // deploy bobs calendar
    let cal2Id;
    [cal2, cal2Id] = await prepareCalendar(calendarFactory, signer2, bobsCalendarConfig);
    chai.expect(cal2Id).to.equal(1);

  });

  it("should initialize calendars correctly", async function() {
    chai.expect(await cal1.timezone()).to.equal(alicesCalendarConfig.timezone);
    chai.expect(await cal2.timezone()).to.equal(bobsCalendarConfig.timezone);
  });

});

describe("Calendar", function() {
  it("book meeting", async function() {

    chai.expect(true).to.equal(false)
  });

  it("cancel meeting", async function() {
    chai.expect(true).to.equal(false)
  });

});

