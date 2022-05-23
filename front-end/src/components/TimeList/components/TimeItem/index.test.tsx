import { render } from "@testing-library/react";
import { DateTime } from "luxon";
import TimeItem from "./index";

describe("<TimeItem />", () => {
  const testData = [true, false];
  testData.forEach((active) =>
    it(`should render correctly when active=${active}`, async () => {
      const { asFragment } = render(
        <TimeItem active={active} value={DateTime.fromObject({ hour: 9, minute: 45 }).setLocale("en-us")} />
      );
      expect(asFragment()).toMatchSnapshot();
    })
  );
});
