import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import chai from "chai";
import {
  cal1Config, cal2Config,
  deployCalendarFactory, deployCalendar
} from "./helpers";

describe("Calendar", function() {
  let calendarFactory: Contract;
  let cal1: Contract;
  let cal2: Contract;
  let signer1: Signer;
  let signer2: Signer;

  beforeEach(async function() {
    [signer1, signer2] = await ethers.getSigners();
    [calendarFactory] = await deployCalendarFactory(signer1);
    [cal1] = await deployCalendar(calendarFactory, signer1, cal1Config);
    [cal2] = await deployCalendar(calendarFactory, signer2, cal2Config);
  });

  it("books meetings with others within the available hours", async function() {
    const res0 = await cal2.getMeetings(2021, 12, 31);
    chai.expect(res0).to.be.instanceof(Array);
    chai.expect(res0).to.have.length(0);

    let start1 = [14, 15], end1 = [15, 15];
    await cal2.connect(signer1).bookMeeting(2021, 12, 31, start1, end1);
    const res1 = await cal2.getMeetings(2021, 12, 31);
    chai.expect(res1).to.be.instanceof(Array);
    chai.expect(res1).to.have.length(1);

    chai.expect(res1[0].attendee).to.equal(await signer1.getAddress());
    chai.expect(res1[0].start.slice(0, 2)).to.deep.equal(start1);
    chai.expect(res1[0].end.slice(0, 2)).to.deep.equal(end1);

    const start2 = [15, 30], end2 = [16, 0];
    await cal2.connect(signer1).bookMeeting(2021, 12, 31, start2, end2);
    const res2 = await cal2.getMeetings(2021, 12, 31);
    chai.expect(res2).to.be.instanceof(Array);
    chai.expect(res2).to.have.length(2);

    chai.expect(res2[0].attendee).to.equal(await signer1.getAddress());
    chai.expect(res2[0].start.slice(0, 2)).to.deep.equal(start1);
    chai.expect(res2[0].end.slice(0, 2)).to.deep.equal(end1);

    chai.expect(res2[1].attendee).to.equal(await signer1.getAddress());
    chai.expect(res2[1].start.slice(0, 2)).to.deep.equal(start2);
    chai.expect(res2[1].end.slice(0, 2)).to.deep.equal(end2);
  });

  it("cancels owned meetings", async function() {
    const start = [14, 15], end = [15, 15];
    await cal2.connect(signer1).bookMeeting(2021, 12, 31, start, end);
    await cal2.connect(signer1).cancelMeeting(2021, 12, 31, 0);

    const res = await cal2.getMeetings(2021, 12, 31);
    chai.expect(res).to.be.instanceof(Array);
    chai.expect(res).to.be.empty;
  });

  it("reverts on cancelling non-existing meetings", async function() {
    let id = 0;
    await chai.expect(cal2.connect(signer1).cancelMeeting(2021, 12, 31, id)
    ).to.be.revertedWith("Meeting does not exist.");

    cal2.connect(signer1).bookMeeting(2021, 12, 31, [14, 15], [15, 15]);

    id = 1;
    await chai.expect(cal2.connect(signer1).cancelMeeting(2021, 12, 31, id)
    ).to.be.revertedWith("Meeting does not exist.");
  });

  it("prohibits cancelling meetings of others", async function() {
    await cal2.connect(signer1).bookMeeting(2021, 12, 31, [14, 15], [15, 15]);

    let id = 0;
    await chai.expect(cal2.connect(signer2).cancelMeeting(2021, 12, 31, id)
    ).to.be.revertedWith("You cannot cancel a meeting that you have not booked yourself.");
  });

  it("prohibits booking meetings with yourself", async function() {
    await chai.expect(
      cal2.connect(signer2).bookMeeting(2021, 12, 31, [14, 15], [15, 15])
    ).to.be.revertedWith("You cannot book a meeting with yourself.");
  });

});

