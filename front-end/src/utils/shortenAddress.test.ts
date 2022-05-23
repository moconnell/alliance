import { shortenAddress } from "./shortenAddress";

describe("shortenAddress", () => {
  const testData = [
    { input: undefined, expected: undefined },
    { input: "me@mydomain.com", expected: "me@my...com" },
    { input: "mr_bluesky@tutanota.com", expected: "mr_bl...com" },
  ];

  testData.forEach(({ input, expected }) => {
    it(`should shorten ${input}`, () => {
      expect(shortenAddress(input)).toStrictEqual(expected);
    });
  });
});
