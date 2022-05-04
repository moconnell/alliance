import { ContractReceipt, ContractTransaction, Signer } from "ethers";
import chai from "chai";
import {
  CalendarFactory,
  CalendarFactory__factory,
  Calendar__factory,
} from "typechain-types";
import {
  AvailabilityStruct,
  ProfileStruct,
} from "typechain-types/CalendarFactory";

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
  SunThu = Monday | Tuesday | Wednesday | Thursday | Sunday,
  All = SunThu | Friday | Saturday,
}

type CalendarConfig = {
  profile: ProfileStruct;
  availability: AvailabilityStruct;
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
    availableDays: DaysOfWeek.SunThu,
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
    availableDays: DaysOfWeek.SunThu,
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
  let tx = await calendarFactory
    .connect(signer)
    .createCalendar(profile, availability);
  let receipt = await tx.wait();
  const txEvent = receipt.events?.[0]?.args;
  let ownerAddr = txEvent?.owner;
  let calendarAddr = txEvent?.calendar;

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
