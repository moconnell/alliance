import { ethers } from "hardhat";
import { Signer } from "ethers";
import { Calendar, CalendarFactory } from "typechain-types";
import chai from "chai";
import {
  cal1Config,
  cal2Config,
  cal3Config,
  deployCalendarFactory,
  deployCalendar,
  DayOfWeek,
  DaysOfWeek,
} from "./helpers";

const addDays = (date: Date, days: number) => {
  let date1 = new Date(date);
  date1.setDate(date1.getDate() + days);
  return date1;
};

const getNextDate = (dayOfWeek: DayOfWeek) => {
  const today = new Date();
  const daysToAdd = 7 + dayOfWeek - today.getDay();
  return addDays(today, daysToAdd > 7 ? daysToAdd - 7 : daysToAdd);
};

const getNextYearMonthDay = (dayOfWeek: DayOfWeek) => {
  const next = getNextDate(dayOfWeek);
  return toYearMonthDay(next);
};

const toYearMonthDay = (date: Date) => [
  date.getFullYear(),
  date.getMonth() + 1,
  date.getDate(),
];

describe("Calendar", () => {
  let calendarFactory: CalendarFactory;
  let cal1: Calendar, cal2: Calendar, cal3: Calendar;
  let signer1: Signer, signer2: Signer, signer3: Signer;

  beforeEach(async () => {
    [signer1, signer2, signer3] = await ethers.getSigners();
    calendarFactory = await deployCalendarFactory(signer1);
    cal1 = await deployCalendar(calendarFactory, signer1, cal1Config);
    cal2 = await deployCalendar(calendarFactory, signer2, cal2Config);
    cal3 = await deployCalendar(calendarFactory, signer3, cal3Config);
  });

  it("sets profile", async () => {
    const email = "my_new_email@new-provider.com";
    let newProfile = { ...cal1Config.profile, email };
    await cal1.setProfile(newProfile);
    const chainProfile = await cal1.profile();
    chai.expect(chainProfile.email).to.equal(email);
  });

  it("sets availability", async () => {
    const availableDays = DaysOfWeek.Thursday | DaysOfWeek.Friday;
    let newAvailability = { ...cal1Config.availability, availableDays };
    await cal1.setAvailability(newAvailability);
    const chainAvailability = await cal1.availability();
    chai.expect(chainAvailability.availableDays).to.equal(availableDays);
  });

  it("sets profile, availability", async () => {
    const email = "my_new_email@new-provider.com";
    let newProfile = { ...cal1Config.profile, email };
    const availableDays = DaysOfWeek.Thursday | DaysOfWeek.Friday;
    let newAvailability = { ...cal1Config.availability, availableDays };
    await cal1.setProfileAvailability(newProfile, newAvailability);
    const chainProfile = await cal1.profile();
    chai.expect(chainProfile.email).to.equal(email);
    const chainAvailability = await cal1.availability();
    chai.expect(chainAvailability.availableDays).to.equal(availableDays);
  });

  const timesTestData = [
    {
      name: "get cal1 available meeting times when no other meetings",
      calendar: 1,
      meetings: [],
      duration: 60,
      expectedTimes: [570, 630, 690, 750, 810, 870, 930, 990],
      expectedTimeZone: "America/New_York",
    },
    {
      name: "get cal1 available meeting times when one other meeting",
      calendar: 1,
      meetings: [{ hour: 10, min: 30, duration: 60 }],
      duration: 60,
      expectedTimes: [570, 690, 750, 810, 870, 930, 990],
      expectedTimeZone: "America/New_York",
    },
    {
      name: "get cal2 available meeting times when no other meetings",
      calendar: 2,
      meetings: [],
      duration: 60,
      expectedTimes: [480, 540, 600, 660, 720, 780, 840, 900, 960],
      expectedTimeZone: "Australia/Sydney",
    },
    {
      name: "get cal2 available meeting times when one other meeting",
      calendar: 2,
      meetings: [
        { hour: 10, min: 0, duration: 60 },
        { hour: 15, min: 0, duration: 60 },
      ],
      duration: 60,
      expectedTimes: [480, 540, 660, 720, 780, 840, 960],
      expectedTimeZone: "Australia/Sydney"
    },
    {
      name: "return empty array for meeting times request with unavailable day",
      calendar: 1,
      date: getNextYearMonthDay(DayOfWeek.Saturday),
      duration: 60,
      expectedTimes: [],
      expectedTimeZone: "America/New_York",
    },
    {
      name: "reject meeting times request with date in the past",
      calendar: 2,
      date: [1999, 12, 31],
      duration: 60,
      error: "Date is in the past",
    },
    {
      name: "reject meeting times request with invalid date",
      calendar: 2,
      date: [getNextYearMonthDay(DayOfWeek.Saturday)[0] + 1, 0, 29],
      duration: 60,
      error: "Date and time are not valid.",
    },
  ];

  timesTestData.forEach(
    ({ name, calendar, date, meetings, duration, expectedTimes, expectedTimeZone, error }) =>
      it(`should ${name}`, async function () {
        const getCalendar = () => {
          switch (calendar) {
            case 1:
              return { cal: cal1, signer: signer2 };
            case 2:
              return { cal: cal2, signer: signer1 };
            case 3:
              return { cal: cal3, signer: signer2 };
            default:
              throw new Error(`Unknown calendar: ${calendar}`);
          }
        };
        const { cal, signer } = getCalendar();
        const [year, month, day] =
          date ?? getNextYearMonthDay(DayOfWeek.Monday);

        if (meetings) {
          const res0 = await cal.getMeetings(year, month, day);
          chai.expect(res0).to.be.instanceof(Array);
          chai.expect(res0).to.have.length(0);

          await Promise.all(
            meetings.map(async ({ hour, min, duration }) => {
              await cal
                .connect(signer)
                .bookMeeting(year, month, day, hour, min, duration);
            })
          );

          const res1 = await cal.getMeetings(year, month, day);
          chai.expect(res1).to.be.instanceof(Array);
          chai.expect(res1).to.have.length(meetings.length);
        }

        if (error) {
          await chai
            .expect(
              cal.connect(signer).getAvailableTimes(year, month, day, duration)
            )
            .to.be.revertedWith(error);
        } else {
          const res2 = await cal.getAvailableTimes(year, month, day, duration);
          chai.expect(res2.timeZone).to.equal(expectedTimeZone);
          chai.expect(res2.times).to.be.instanceof(Array);
          chai.expect(res2.times.filter((x) => x >= 0)).to.deep.equal(expectedTimes);
        }
      })
  );

  it("books meetings with others within the available hours", async function () {
    const [year, month, day] = getNextYearMonthDay(DayOfWeek.Monday);
    const signer1Address = await signer1.getAddress();

    const res0 = await cal2.getMeetings(year, month, day);
    chai.expect(res0).to.be.instanceof(Array);
    chai.expect(res0).to.have.length(0);

    const [hour1, min1] = [14, 15],
      duration = 60;

    await cal2
      .connect(signer1)
      .bookMeeting(year, month, day, hour1, min1, duration);
    const res1 = await cal2.getMeetings(year, month, day);

    chai.expect(res1).to.be.instanceof(Array);
    chai.expect(res1).to.have.length(1);

    chai.expect(res1[0].attendee).to.equal(signer1Address);
    chai.expect(res1[0].startMinutes).to.equal(hour1 * 60 + min1);
    chai.expect(res1[0].durationMinutes).to.equal(duration);

    const [hour2, min2] = [15, 30];
    await cal2
      .connect(signer1)
      .bookMeeting(year, month, day, hour2, min2, duration);
    const res2 = await cal2.getMeetings(year, month, day);
    chai.expect(res2).to.be.instanceof(Array);
    chai.expect(res2).to.have.length(2);

    chai.expect(res2[0].attendee).to.equal(signer1Address);
    chai.expect(res2[0].startMinutes).to.equal(hour1 * 60 + min1);
    chai.expect(res2[0].durationMinutes).to.deep.equal(duration);
    chai.expect(res2[1].attendee).to.equal(signer1Address);
    chai.expect(res2[1].startMinutes).to.equal(hour2 * 60 + min2);
    chai.expect(res2[1].durationMinutes).to.deep.equal(duration);
  });

  it("cancels owned meetings", async function () {
    const [year, month, day] = getNextYearMonthDay(DayOfWeek.Monday);
    const [hour, min] = [14, 15];
    await cal2.connect(signer1).bookMeeting(year, month, day, hour, min, 60);
    await cal2.connect(signer1).cancelMeeting(year, month, day, 0);

    const res = await cal2.getMeetings(year, month, 31);
    chai.expect(res).to.be.instanceof(Array);
    chai.expect(res).to.be.empty;
  });

  it("reverts on cancelling non-existing meetings", async function () {
    const [year, month, day] = getNextYearMonthDay(DayOfWeek.Monday);
    let id = 0;
    await chai
      .expect(cal2.connect(signer1).cancelMeeting(year, month, day, id))
      .to.be.revertedWith("Meeting does not exist.");

    cal2.connect(signer1).bookMeeting(year, month, day, 14, 15, 60);

    id = 1;
    await chai
      .expect(cal2.connect(signer1).cancelMeeting(year, month, day, id))
      .to.be.revertedWith("Meeting does not exist.");
  });

  it("reverts on invalid date and time", async function () {
    const [year, month] = getNextYearMonthDay(DayOfWeek.Monday);
    await chai
      .expect(cal2.connect(signer1).bookMeeting(year, 2, 29, month, 0, 60))
      .to.be.revertedWith("Date and time are not valid.");

    await chai
      .expect(cal2.connect(signer1).bookMeeting(year, 2, 28, 24, 0, 10))
      .to.be.revertedWith("Date and time are not valid.");
  });

  it("prohibits booking meetings outside available days", async function () {
    const [year, month, day] = getNextYearMonthDay(DayOfWeek.Sunday);
    await chai
      .expect(cal2.connect(signer1).bookMeeting(year, month, day, 10, 0, 60))
      .to.be.revertedWith("Day not available.");
  });

  it("prohibits booking meetings outside the available times", async function () {
    const [year, month, day] = getNextYearMonthDay(DayOfWeek.Monday);
    await chai
      .expect(cal2.connect(signer1).bookMeeting(year, month, day, 22, 0, 60))
      .to.be.revertedWith("Time not available.");
  });

  it("prohibits booking meetings in the past", async function () {
    await chai
      .expect(cal2.connect(signer1).bookMeeting(2010, 1, 1, 10, 0, 60))
      .to.be.revertedWith("Cannot book meeting in the past");
  });

  it("prohibits to book a meeting overlapping with an earlier meeting", async function () {
    const [year, month, day] = getNextYearMonthDay(DayOfWeek.Monday);
    await cal1.connect(signer2).bookMeeting(year, month, day, 14, 0, 60);
    await chai
      .expect(cal1.connect(signer3).bookMeeting(year, month, day, 14, 30, 60))
      .to.be.revertedWith("Overlap with existing meeting.");
  });

  it("prohibits to book a meeting overlapping with a later meeting", async function () {
    const [year, month, day] = getNextYearMonthDay(DayOfWeek.Monday);
    await cal1.connect(signer2).bookMeeting(year, month, day, 14, 0, 60);
    await chai
      .expect(cal1.connect(signer3).bookMeeting(year, month, day, 13, 30, 60))
      .to.be.revertedWith("Overlap with existing meeting.");
  });

  it("prohibits to book a meeting falling inside of another meeting", async function () {
    const [year, month, day] = getNextYearMonthDay(DayOfWeek.Monday);
    await cal1.connect(signer2).bookMeeting(year, month, day, 14, 0, 60);
    await chai
      .expect(cal1.connect(signer3).bookMeeting(year, month, day, 14, 20, 20))
      .to.be.revertedWith("Overlap with existing meeting.");
  });

  it("prohibits to book a meeting surrounding another meeting", async function () {
    const [year, month, day] = getNextYearMonthDay(DayOfWeek.Monday);
    await cal1.connect(signer2).bookMeeting(year, month, day, 14, 0, 60);
    await chai
      .expect(cal1.connect(signer3).bookMeeting(year, month, day, 13, 0, 180))
      .to.be.revertedWith("Overlap with existing meeting.");
  });

  it("prohibits to book a meeting that overlaps with a meeting from the previous day", async function () {
    const year = new Date().getFullYear();
    await cal3.connect(signer2).bookMeeting(year, 12, 31, 23, 0, 120);
    await chai
      .expect(cal3.connect(signer2).bookMeeting(year + 1, 1, 1, 0, 30, 60))
      .to.be.revertedWith("Overlaps meeting previous day");
  });

  it("prohibits to book a meeting that overlaps with a meeting from the next day", async function () {
    const year = new Date().getFullYear();
    await cal3.connect(signer2).bookMeeting(year + 1, 1, 1, 0, 30, 60);

    await chai
      .expect(cal3.connect(signer2).bookMeeting(year, 12, 31, 23, 0, 120))
      .to.be.revertedWith("Overlaps meeting next day");
  });

  it("prohibits cancelling meetings of others", async function () {
    const [year, month, day] = getNextYearMonthDay(DayOfWeek.Monday);
    await cal2.connect(signer1).bookMeeting(year, month, day, 14, 15, 60);

    let id = 0;
    await chai
      .expect(cal2.connect(signer2).cancelMeeting(year, month, day, id))
      .to.be.revertedWith("Not your booking!");
  });

  it("prohibits booking meetings with yourself", async function () {
    const [year, month, day] = getNextYearMonthDay(DayOfWeek.Monday);
    await chai
      .expect(cal2.connect(signer2).bookMeeting(year, month, day, 14, 15, 60))
      .to.be.revertedWith("Cannot book meeting with self");
  });
});
