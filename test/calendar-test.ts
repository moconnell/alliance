import { ethers } from "hardhat";
import {
  Contract,
  ContractTransaction,
  ContractReceipt,
  BigNumber
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
    const [alice, bob] = await ethers.getSigners();

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
    let alicesTx: ContractTransaction = await calendarFactory.connect(alice).createCalendar(...Object.values(alicesCalendarConfig))
    let alicesReceipt: ContractReceipt = await alicesTx.wait();
    const aliceEvent = alicesReceipt.events?.[0]?.args;
    let alicesAddress = aliceEvent?.userAddress;
    let alicesCalendarAddress = aliceEvent?.calenderAddress;
    let alicesCalendarId = aliceEvent?.id;

    chai.expect(alicesAddress).to.equal(alice.address);
    const alicesCalendarAddressFromMapping = await calendarFactory.calendarIdToCalendar(alicesCalendarId);
    chai.expect(alicesCalendarAddress).to.equal(alicesCalendarAddressFromMapping);
    chai.expect(alicesCalendarId).to.equal(BigNumber.from(0));

    alicesCalendar = await ethers.getContractAt("Calendar", alicesCalendarAddress);

    // deploy bobs calendar
    let bobsTx: ContractTransaction = await calendarFactory.connect(bob).createCalendar(...Object.values(bobsCalendarConfig))
    let bobsReceipt: ContractReceipt = await bobsTx.wait();
    const bobEvent = bobsReceipt.events?.[0]?.args;
    let bobsAddress = bobEvent?.userAddress;
    let bobsCalendarAddress = bobEvent?.calenderAddress;
    let bobsCalendarId = bobEvent?.id;

    chai.expect(bobsAddress).to.equal(bob.address);
    const bobsCalendarAddressFromMapping = await calendarFactory.calendarIdToCalendar(bobsCalendarId);
    chai.expect(bobsCalendarAddress).to.equal(bobsCalendarAddressFromMapping);

    chai.expect(bobsCalendarId).to.equal(BigNumber.from(1));

    bobsCalendar = await ethers.getContractAt("Calendar", bobsCalendarAddress);

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

