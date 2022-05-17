import DayOfWeek from "../types/dayOfWeek";
import DaysOfWeek from "../types/daysOfWeek";
import { isAvailable, toDaysOfWeek } from "./daysOfWeekUtils";

describe("toDaysOfWeek", () => {
  const testData = [
    { input: DayOfWeek.Sunday, expected: DaysOfWeek.Sunday },
    { input: DayOfWeek.Monday, expected: DaysOfWeek.Monday },
    { input: DayOfWeek.Tuesday, expected: DaysOfWeek.Tuesday },
    { input: DayOfWeek.Wednesday, expected: DaysOfWeek.Wednesday },
    { input: DayOfWeek.Thursday, expected: DaysOfWeek.Thursday },
    { input: DayOfWeek.Friday, expected: DaysOfWeek.Friday },
    { input: DayOfWeek.Saturday, expected: DaysOfWeek.Saturday },
  ];

  testData.forEach(({ input, expected }) => {
    it(`should convert ${DayOfWeek[input]}`, () => {
      expect(toDaysOfWeek(input)).toStrictEqual(expected);
    });
  });
});

describe("isAvailable", () => {
  const testData = [
    {
      date: new Date(Date.parse("2022-05-08")),
      availableDays: DaysOfWeek.MonFri,
      expected: false,
    },
    {
      date: new Date(Date.parse("2022-05-09")),
      availableDays: DaysOfWeek.MonFri,
      expected: true,
    },
    {
      date: new Date(Date.parse("2022-05-10")),
      availableDays: DaysOfWeek.Tuesday,
      expected: true,
    },
  ];

  testData.forEach(({ date, availableDays, expected }) => {
    it(`should return ${expected} for ${date} and ${availableDays}`, () => {
      expect(isAvailable(date, availableDays)).toStrictEqual(expected);
    });
  });
});
