import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import chai, { expect } from "chai";
import {
  cal1Config, cal2Config,
  prepareCalendarFactory, prepareCalendar
} from "./helpers"

describe("CalendarFactory", function() {
  let calendarFactory: Contract;
  let cal1: Contract;
  let cal2: Contract;
  let signer1: Signer;
  let signer2: Signer;
  let cal1Id : Number;
  let cal2Id : Number;

  beforeEach(async function() {
    [signer1, signer2]  = await ethers.getSigners();
    [calendarFactory] = await prepareCalendarFactory(signer1);
    [cal1, cal1Id] = await prepareCalendar(calendarFactory, signer1, cal1Config);
    [cal2, cal2Id] = await prepareCalendar(calendarFactory, signer2, cal2Config);
  });

  it("should initialize calendars correctly", async function() {
    chai.expect(cal1Id).to.equal(0);
    chai.expect(cal2Id).to.equal(1);

    chai.expect(await cal1.timezone()).to.equal(cal1Config.timezone);
    chai.expect(await cal2.timezone()).to.equal(cal2Config.timezone);
  });

});

describe("Calendar", function() {
  let calendarFactory: Contract;
  let cal1: Contract;
  let cal2: Contract;
  let signer1: Signer;
  let signer2: Signer;

  beforeEach(async function() {
    [signer1, signer2]  = await ethers.getSigners();
    [calendarFactory] = await prepareCalendarFactory(signer1);
    [cal1] = await prepareCalendar(calendarFactory, signer1, cal1Config);
    [cal2] = await prepareCalendar(calendarFactory, signer2, cal2Config);
  });

  it("book meeting", async function() {
    cal1

    chai.expect(true).to.equal(false)
  });

  it("cancel meeting", async function() {
    chai.expect(true).to.equal(false)
  });

});

