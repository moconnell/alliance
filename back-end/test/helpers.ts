import { Signer } from "ethers";
import chai from "chai";
import {
  CalendarFactory__factory,
  CalendarFactory,
  Calendar__factory,
} from "../typechain-types";
import { CalendarTypes } from "../typechain-types/contracts/Calendar";

enum DayOfWeek {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

enum DaysOfWeek {
  None = 0,
  Sunday = 1 << 0,
  Monday = 1 << 1,
  Tuesday = 1 << 2,
  Wednesday = 1 << 3,
  Thursday = 1 << 4,
  Friday = 1 << 5,
  Saturday = 1 << 6,
  MonFri = Monday | Tuesday | Wednesday | Thursday | Friday,
  All = MonFri | Saturday | Sunday,
}

type CalendarConfig = {
  profile: CalendarTypes.ProfileStruct;
  availability: CalendarTypes.AvailabilityStruct;
};

const cal1Config = {
  profile: {
    email: "alice@mail.com",
    username: "alicep",
    picture: "http://stock-imgs.com/alicep2342/profile.jpg",
    url: "aliceparsons.com",
    description: "performance artist",
  },
  availability: {
    availableDays: DaysOfWeek.MonFri,
    location: "New York",
    timeZone: "America/New_York",
    earliestStartMinutes: 9 * 60 + 30, //  09:30
    minutesAvailable: 8 * 60, // 17:30
  },
};

const cal2Config = {
  profile: {
    email: "bob@mail.com",
    username: "bobslob",
    picture: "http://stock-imgs.com/boblslob2398742/profile.jpg",
    url: "bobstraining.com",
    description: "personal trainer",
  },
  availability: {
    availableDays: DaysOfWeek.MonFri,
    location: "Sydney",
    timeZone: "Australia/Sydney",
    earliestStartMinutes: 8 * 60, // 08:00
    minutesAvailable: 9 * 60, // 17:00
  },
};

const cal3Config = {
  profile: {
    email: "carl@mail.com",
    username: "carl1",
    picture: "",
    url: "",
    description: "",
  },
  availability: {
    availableDays: DaysOfWeek.All,
    location: "London",
    timeZone: "Europe/London",
    earliestStartMinutes: 18 * 60, //  16:00
    minutesAvailable: 8 * 60, // 02:00 +1 day
  },
};

const deployCalendarFactory = async (deployer: Signer) =>
  await new CalendarFactory__factory(deployer).deploy();

const deployCalendar = async (
  calendarFactory: CalendarFactory,
  signer: Signer,
  { profile, availability }: CalendarConfig
) => {
  const tx = await calendarFactory
    .connect(signer)
    .createCalendar(profile, availability);
  const receipt = await tx.wait();

  const events = receipt.events!;
  const result = events[0].args ?? events[1].args;
  chai.expect(result).not.to.be.undefined;

  const ownerAddr = result!.owner;
  const calendarAddr = result!.calendar;
  chai.expect(ownerAddr).to.equal(await signer.getAddress());

  const calendarAddressFromMapping = await calendarFactory.userToCalendar(
    ownerAddr
  );
  chai.expect(calendarAddr).to.equal(calendarAddressFromMapping);

  return Calendar__factory.connect(calendarAddr, signer);
};

export {
  DayOfWeek,
  DaysOfWeek,
  cal1Config,
  cal2Config,
  cal3Config,
  deployCalendarFactory,
  deployCalendar,
};
