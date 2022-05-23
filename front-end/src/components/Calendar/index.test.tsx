import { render } from "@testing-library/react";
import Calendar from "./index";

describe("<Calendar />", () => {
  const testData: [string, Date, ((date: Date) => boolean)?][] = [
    ["render correctly", new Date("2022/05/22")],
    ["render correctly", new Date("2022/05/22"), (date: Date) => date.getDay() > 0],
  ];

  testData.forEach(([name, defaultValue, tileDisabled]) =>
    it(`should ${name}`, async () => {
      const { asFragment } = render(<Calendar defaultValue={defaultValue} tileDisabled={tileDisabled} />);
      expect(asFragment()).toMatchSnapshot();
    })
  );
});
