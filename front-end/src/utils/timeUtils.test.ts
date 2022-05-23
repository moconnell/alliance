import {
  assertValid,
  compare,
  fromTotalMins,
  tomorrow,
  totalMinutes,
  totalSeconds,
} from "./timeUtils";

describe("assertValid", () => {
  const testData1 = [
    { input: { hours: 9, minutes: 0 } },
    { input: { hours: 9, minutes: 30 } },
  ];

  testData1.forEach(({ input }) => {
    it(`should pass assert ${input.hours}:${input.minutes}`, () => {
      expect(assertValid(input)).toBeUndefined();
    });
  });

  const testData2 = [
    { input: { hours: 9, minutes: 67 }, expected: "invalid minutes" },
    { input: { hours: 9, minutes: -1 }, expected: "invalid minutes" },
    { input: { hours: -9, minutes: 0 }, expected: "invalid hours" },
    { input: { hours: 29, minutes: 0 }, expected: "invalid hours" },
  ];

  testData2.forEach(({ input, expected }) => {
    it(`should fail assert ${input.hours}:${input.minutes} with '${expected}'`, () => {
      expect(() => assertValid(input)).toThrowError(expected);
    });
  });
});

describe("compare", () => {
  const testData1 = [
    {
      input1: { hours: 9, minutes: 0 },
      input2: { hours: 9, minutes: 0 },
      expected: 0,
    },
    {
      input1: { hours: 9, minutes: 1 },
      input2: { hours: 9, minutes: 0 },
      expected: 1,
    },
    {
      input1: { hours: 8, minutes: 59 },
      input2: { hours: 9, minutes: 0 },
      expected: -1,
    },
  ];

  testData1.forEach(({ input1, input2, expected }) => {
    it(`should compare ${input1.hours}:${input1.minutes} and ${input2.hours}:${input2.minutes} and return ${expected}`, () => {
      expect(compare(input1, input2)).toStrictEqual(expected);
    });
  });
});

describe("fromTotalMins", () => {
  const testData = [
    { input: 540, expected: { hours: 9, minutes: 0 } },
    { input: 570, expected: { hours: 9, minutes: 30 } },
    { input: 1980, expected: { hours: 9, minutes: 0 } },
    { input: 2010, expected: { hours: 9, minutes: 30 } },
  ];

  testData.forEach(({ input, expected }) => {
    it(`should convert ${input} mins`, () => {
      expect(fromTotalMins(input)).toStrictEqual(expected);
    });
  });
});

describe("totalMinutes", () => {
  const testData = [
    { input: { hours: 9, minutes: 0 }, expected: 540 },
    { input: { hours: 9, minutes: 30 }, expected: 570 },
  ];

  testData.forEach(({ input, expected }) => {
    it(`should convert ${input}`, () => {
      expect(totalMinutes(input)).toStrictEqual(expected);
    });
  });
});

describe("totalSeconds", () => {
  const testData = [
    { input: { hours: 9, minutes: 0 }, expected: 32400 },
    { input: { hours: 9, minutes: 30 }, expected: 34200 },
  ];

  testData.forEach(({ input, expected }) => {
    it(`should convert ${input.hours}:${input.minutes}`, () => {
      expect(totalSeconds(input)).toStrictEqual(expected);
    });
  });
});

describe("tomorrow", () => {
  it("should return tomorrow's date", () => {
    const d = tomorrow();
    const now = new Date();
    expect(d.getDate()).toBe(now.getDate() + 1);
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(d.getSeconds()).toBe(0);
  });
});
