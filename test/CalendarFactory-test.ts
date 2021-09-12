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
    calendarFactory = await deployCalendarFactory(signer1);
    [cal1, cal1Id] = await deployCalendar(calendarFactory, signer1, cal1Config);
    [cal2, cal2Id] = await deployCalendar(calendarFactory, signer2, cal2Config);
  });

  it("initializes calendars", async function() {
    chai.expect(cal1Id).to.equal(0);
    chai.expect(cal2Id).to.equal(1);

    chai.expect(await cal1.emailAddress()).to.equal(cal1Config.emailAddress);
    chai.expect(await cal2.emailAddress()).to.equal(cal2Config.emailAddress);
  });

  it("counts calendars", async function() {
    chai.expect(await calendarFactory.calendarCount()).to.equal(2);
  });

  it("remove calendar", async function() {
    let id = 0;
    await calendarFactory.remove(id);
  });

  it("reverts remove if calendar does not exist", async function() {
    let id = 2;
    await chai.expect(
      calendarFactory.connect(signer1).remove(id)
    ).to.be.revertedWith("Calendar does not exist.");
  });

  it("reverts remove if sender is not the owner", async function() {
    let id = 0;
    await chai.expect(
      calendarFactory.connect(signer2).remove(id)
    ).to.be.revertedWith("Calendar is not owned by you.");
  });

});