import { ethers } from "hardhat";
import { Signer } from "ethers";
import chai from "chai";
import {
  cal1Config,
  cal2Config,
  deployCalendarFactory,
  deployCalendar,
} from "./helpers";
import { Calendar, CalendarFactory } from "typechain-types";
import {
  AvailabilityStruct,
  ProfileStruct,
} from "typechain-types/CalendarFactory";

const assertProfileEqual = (
  profile1: ProfileStruct,
  profile2: ProfileStruct
) => {
  chai.expect(profile1.description).to.equal(profile2.description);
  chai.expect(profile1.email).to.equal(profile2.email);
  chai.expect(profile1.picture).to.equal(profile2.picture);
  chai.expect(profile1.url).to.equal(profile2.url);
  chai.expect(profile1.username).to.equal(profile2.username);
};

const assertAvailabilityEqual = (
  availability1: AvailabilityStruct,
  availability2: AvailabilityStruct
) => {
  chai
    .expect(availability1.availableDays)
    .to.equal(availability2.availableDays);
  chai
    .expect(availability1.earliestTimeInMinutes)
    .to.equal(availability2.earliestTimeInMinutes);
  chai.expect(availability1.location).to.equal(availability2.location);
  chai
    .expect(availability1.minutesAvailable)
    .to.equal(availability2.minutesAvailable);
  chai.expect(availability1.timeZone).to.equal(availability2.timeZone);
};

describe("CalendarFactory", () => {
  let calendarFactory: CalendarFactory;
  let cal1: Calendar, cal2: Calendar;
  let signer1: Signer, signer2: Signer, signer3: Signer;

  beforeEach(async () => {
    [signer1, signer2, signer3] = await ethers.getSigners();
    calendarFactory = await deployCalendarFactory(signer1);
    cal1 = await deployCalendar(calendarFactory, signer1, cal1Config);
    cal2 = await deployCalendar(calendarFactory, signer2, cal2Config);
  });

  it("initializes calendars", async () => {
    const profile1 = await cal1.profile();
    assertProfileEqual(profile1, cal1Config.profile);
    const availability1 = await cal1.availability();
    assertAvailabilityEqual(availability1, cal1Config.availability);

    const profile2 = await cal2.profile();
    assertProfileEqual(profile2, cal2Config.profile);
    const availability2 = await cal2.availability();
    assertAvailabilityEqual(availability2, cal2Config.availability);
  });

  it("remove calendar", async function () {
    await calendarFactory.connect(signer1).remove();
    await calendarFactory.connect(signer2).remove();
  });

  it("reverts remove if calendar does not exist", async function () {
    await chai
      .expect(calendarFactory.connect(signer3).remove())
      .to.be.revertedWith("Calendar does not exist.");
  });
});
