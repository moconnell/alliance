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


describe("CalendarFactory", function() {
  let calendarLib: Contract;
  let calendarFactory : Contract;
  let alicesCalendar: Contract;
  let bobsCalendar: Contract;

  beforeEach(async function() {
    const [alice, bob]  = await ethers.getSigners();

    async function prepareCalendar(calendarFactory: Contract, signer: Signer, config: Object) {
      let tx: ContractTransaction = await calendarFactory.connect(signer).createCalendar(...Object.values(config));
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

    // deploy CalendarLib
    const CalendarLib = await ethers.getContractFactory("CalendarLib");
    calendarLib = await CalendarLib.deploy();

    // deploy CalendarFactory
    const CalendarFactory = await ethers.getContractFactory("CalendarFactory", {
      libraries: {
        CalendarLib: calendarLib.address
      } });
    calendarFactory = await CalendarFactory.deploy();

    // deploy alice's calendar
    let alicesCalendarId;
    [alicesCalendar, alicesCalendarId] = await prepareCalendar(calendarFactory, alice, alicesCalendarConfig);
    chai.expect(alicesCalendarId).to.equal(0);

    // deploy bobs calendar
    let bobsCalendarId;
    [bobsCalendar, bobsCalendarId] = await prepareCalendar(calendarFactory, bob, bobsCalendarConfig);
    chai.expect(bobsCalendarId).to.equal(1);
  });

  it("should initialize calendars correctly", async function() {
    chai.expect(await alicesCalendar.timezone()).to.equal(alicesCalendarConfig.timezone);
    chai.expect(await bobsCalendar.timezone()).to.equal(bobsCalendarConfig.timezone);
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

