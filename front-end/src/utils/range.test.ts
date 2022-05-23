import { range } from "./range";

describe("range", () => {
  const testData = [
    { start: 0, end: 3, expected: [0, 1, 2, 3] },
    { start: 3, end: 0, expected: [3, 2, 1, 0] },
    { start: 0, end: 0, expected: [0] },
  ];

  testData.forEach(({ start, end, expected }) => {
    it(`should create range(${start}, ${end})`, () => {
      expect(range(start, end)).toStrictEqual(expected);
    });
  });
});
