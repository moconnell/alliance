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
  let signer1: Signer, signer2: Signer, signer3: Signer;
  let cal1Id: Number, cal2Id: Number;

  beforeEach(async function() {
    [signer1, signer2, signer3] = await ethers.getSigners();
    calendarFactory = await deployCalendarFactory(signer1);
    cal1 = await deployCalendar(calendarFactory, signer1, cal1Config);
    cal2 = await deployCalendar(calendarFactory, signer2, cal2Config);
  });

  it("initializes calendars", async function() {
    chai.expect(await cal1.emailAddress()).to.equal(cal1Config.emailAddress);
    chai.expect(await cal2.emailAddress()).to.equal(cal2Config.emailAddress);
  });


  it("remove calendar", async function() {
    await calendarFactory.connect(signer1).remove();
    await calendarFactory.connect(signer2).remove();
  });

  it("reverts remove if calendar does not exist", async function() {
    await chai.expect(
      calendarFactory.connect(signer3).remove()
    ).to.be.revertedWith("Calendar does not exist.")
  });
});