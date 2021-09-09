import { ethers } from "hardhat";
import { Contract, BigNumber } from "ethers";
import chai, { expect } from "chai";

describe("CalendarFactory", function() {
  let sender: string;
  let clockLib: Contract;

  beforeEach(async function() {
    sender = await (await ethers.getSigners())[0].getAddress();
    const ClockLib = await ethers.getContractFactory("Clock");
    clockLib = await ClockLib.deploy();
  });


  it("Calendar initialization", async function() {

    const CalendarFactory = await ethers.getContractFactory("CalendarFactory", {
      libraries: {
        Clock: clockLib.address
      }
    });
    const calendarFactory = await CalendarFactory.deploy();

    // Create debate
    const timezone = 0; // timezone UTC
    const emailAddress = "test@gmail.com";
    const availableDays = [true, true, true, true, true, false, false];
    const startTime = [12, 30]; // 12:30
    const endTime = [16, 30]; // 16:30

    const id = (await calendarFactory.createCalendar(
      timezone,
      emailAddress,
      availableDays,
      startTime,
      endTime
    )).value.toBigInt();
    chai.expect(id).to.equal(BigNumber.from(0));

    const calendar_addr = await calendarFactory.calendarIdToCalendar(id);
    const calendar = await ethers.getContractAt("Calendar", calendar_addr);

    chai.expect(await calendar.timezone()).to.equal(0);
    chai.expect(await calendar.emailAddress()).to.equal("test@gmail.com");
  });
});

