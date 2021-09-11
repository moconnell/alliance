import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import chai from "chai";
import {
  cal1Config, cal2Config,
  deployCalendarFactory, deployCalendar
} from "./helpers";

describe("Calendar", function() {
  let calendarFactory: Contract, calendarLib: Contract;
  let cal1: Contract, cal2: Contract;
  let signer1: Signer, signer2: Signer, signer3: Signer;

  beforeEach(async function() {
    [signer1, signer2, signer3] = await ethers.getSigners();
    [calendarFactory, calendarLib] = await deployCalendarFactory(signer1);
    [cal1] = await deployCalendar(calendarFactory, signer1, cal1Config);
    [cal2] = await deployCalendar(calendarFactory, signer2, cal2Config);
  });

  it("books meetings with others within the available hours", async function() {
    const signer1Address = await signer1.getAddress();

    const res0 = await cal2.getMeetings(2021, 12, 31);
    chai.expect(res0).to.be.instanceof(Array);
    chai.expect(res0).to.have.length(0);

    const start1 = [14, 15], duration = 60;

    await cal2.connect(signer1).bookMeeting(2021, 12, 31, start1, duration);
    const res1 = await cal2.getMeetings(2021, 12, 31);

    chai.expect(res1).to.be.instanceof(Array);
    chai.expect(res1).to.have.length(1);

    chai.expect(res1[0].attendee).to.equal(signer1Address);
    chai.expect(res1[0].start.slice(0, 2)).to.deep.equal(start1);
    chai.expect(res1[0].durationInMinutes).to.deep.equal(duration);


    const start2 = [15, 30];
    await cal2.connect(signer1).bookMeeting(2021, 12, 31, start2, duration);
    const res2 = await cal2.getMeetings(2021, 12, 31);
    chai.expect(res2).to.be.instanceof(Array);
    chai.expect(res2).to.have.length(2);
    chai.expect(res2[0].attendee).to.equal(signer1Address);
    chai.expect(res2[0].start.slice(0, 2)).to.deep.equal(start1);
    chai.expect(res2[0].durationInMinutes).to.deep.equal(duration);
    chai.expect(res2[1].attendee).to.equal(signer1Address);
    chai.expect(res2[1].start.slice(0, 2)).to.deep.equal(start2);
    chai.expect(res2[1].durationInMinutes).to.deep.equal(duration);

  });


  it("cancels owned meetings", async function() {
    const start = [14, 15];
    await cal2.connect(signer1).bookMeeting(2021, 12, 31, start, 60);
    await cal2.connect(signer1).cancelMeeting(2021, 12, 31, 0);

    const res = await cal2.getMeetings(2021, 12, 31);
    chai.expect(res).to.be.instanceof(Array);
    chai.expect(res).to.be.empty;
  });

  it("reverts on cancelling non-existing meetings", async function() {
    let id = 0;
    await chai.expect(cal2.connect(signer1).cancelMeeting(2021, 12, 31, id)
    ).to.be.revertedWith("Meeting does not exist.");

    cal2.connect(signer1).bookMeeting(2021, 12, 31, [14, 15], 60);

    id = 1;
    await chai.expect(cal2.connect(signer1).cancelMeeting(2021, 12, 31, id)
    ).to.be.revertedWith("Meeting does not exist.");
  });

  it("prohibits booking meetings outside available days", async function() {
    await chai.expect(cal2.connect(signer1).bookMeeting(2022, 1, 1, [10, 0], 60)
    ).to.be.revertedWith("Day not available.");
  });

  it("prohibits booking meetings outside the available times", async function() {
    await chai.expect(cal2.connect(signer1).bookMeeting(2010, 1, 1, [22, 0], 60)
    ).to.be.revertedWith("Time not available.");
  });

  it("prohibits booking meetings in the past", async function() {
    await chai.expect(cal2.connect(signer1).bookMeeting(2010, 1, 1, [10, 0], 60)
    ).to.be.revertedWith("Cannot book meeting in the past");
  });

  it("prohibits to book a meeting overlapping with an earlier meeting", async function() {
    await cal1.connect(signer2).bookMeeting(2021, 12, 31, [14, 0], 60);
    await chai.expect(
      cal1.connect(signer3).bookMeeting(2021, 12, 31, [14, 30], 60)
    ).to.be.revertedWith("Overlap with existing meeting.");
  });

  it("prohibits to book a meeting overlapping with a later meeting", async function() {
    await cal1.connect(signer2).bookMeeting(2021, 12, 31, [14, 0], 60);
    await chai.expect(
      cal1.connect(signer3).bookMeeting(2021, 12, 31, [13, 30], 60)
    ).to.be.revertedWith("Overlap with existing meeting.");
  });

  it("prohibits to book a meeting falling inside of another meeting", async function() {
    await cal1.connect(signer2).bookMeeting(2021, 12, 31, [14, 0], 60);
    await chai.expect(
      cal1.connect(signer3).bookMeeting(2021, 12, 31, [14, 20], 20)
    ).to.be.revertedWith("Overlap with existing meeting.");
  });

  it("prohibits to book a meeting surrounding another meeting", async function() {
    await cal1.connect(signer2).bookMeeting(2021, 12, 31, [14, 0], 60);
    await chai.expect(
      cal1.connect(signer3).bookMeeting(2021, 12, 31, [13, 0], 180)
    ).to.be.revertedWith("Overlap with existing meeting.");
  });

  it("prohibits cancelling meetings of others", async function() {
    await cal2.connect(signer1).bookMeeting(2021, 12, 31, [14, 15], 60);

    let id = 0;
    await chai.expect(cal2.connect(signer2).cancelMeeting(2021, 12, 31, id)
    ).to.be.revertedWith(
      "You cannot cancel a meeting that you have not booked yourself.");
  });

  it("prohibits booking meetings with yourself", async function() {
    await chai.expect(
      cal2.connect(signer2).bookMeeting(2021, 12, 31, [14, 15], 60)
    ).to.be.revertedWith("You cannot book a meeting with yourself.");
  });

});
