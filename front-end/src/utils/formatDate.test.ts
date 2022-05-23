import Time from "../types/time";
import { formatDateTime, formatTime } from "./formatDate";

describe("formatDateTime", () => {
  const testData = [
    { input: new Date(Date.parse("2022/02/02 20:00")), expected: "Wednesday, February 2, 2022 at 8:00 PM" },
  ];

  testData.forEach(({ input, expected }) => {
    it(`should convert ${input}`, () => {
      expect(formatDateTime(input)).toStrictEqual(expected);
    });
  });
});

describe("formatTime", () => {
  const testData = [
    { input: {hours:20, minutes: 0} as Time, expected: "8:00 PM" },
    { input: new Date(2020, 1, 1, 20), expected: "8:00 PM" },
  ];

  testData.forEach(({ input, expected }) => {
    it(`should convert ${input}`, () => {
      expect(formatTime(input)).toStrictEqual(expected);
    });
  });
});
