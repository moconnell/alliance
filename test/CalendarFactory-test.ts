import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import chai from "chai";
import {
  cal1Config, cal2Config,
  deployCalendarFactory, deployCalendar
} from "./helpers";

describe("CalendarFactory", function() {
  let calendarFactory: Contract;
  let cal1: Contract;
  let cal2: Contract;
  let signer1: Signer, signer2: Signer;
  let cal1Id: Number, cal2Id: Number;

  beforeEach(async function() {
    [signer1, signer2] = await ethers.getSigners();
    [calendarFactory] = await deployCalendarFactory(signer1);
    [cal1, cal1Id] = await deployCalendar(calendarFactory, signer1, cal1Config);
    [cal2, cal2Id] = await deployCalendar(calendarFactory, signer2, cal2Config);
  });

  it("initializes calendars correctly", async function() {
    chai.expect(cal1Id).to.equal(0);
    chai.expect(cal2Id).to.equal(1);

    chai.expect(await cal1.emailAddress()).to.equal(cal1Config.emailAddress);
    chai.expect(await cal2.emailAddress()).to.equal(cal2Config.emailAddress);
  });
});