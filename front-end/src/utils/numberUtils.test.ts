import { toBooleanArray } from "./numberUtils";

describe("toBooleanArray", () => {
  const testData = [
    { binary: 0b0110, expected: [true, true, false] },
    { binary: 0b0110, length: 5, expected: [false, false, true, true, false] },
    {
      binary: 0b0110110,
      length: 7,
      expected: [false, true, true, false, true, true, false],
    },
  ];

  testData.forEach(({ binary, length, expected }) => {
    it(`should convert 0b${binary.toString(2)} to boolean array`, () => {
      expect(toBooleanArray(binary, length)).toStrictEqual(expected);
    });
  });
});
