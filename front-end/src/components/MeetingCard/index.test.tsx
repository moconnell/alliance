import { render } from "@testing-library/react";
import { DateTime } from "luxon";
import MeetingCard from "./index";

describe("<MeetingCard />", () => {
  it("should render correctly", async () => {
    const meeting = {
      date: DateTime.fromISO("2022-02-02T20:00:00").setLocale("en-gb"),
      endDate: DateTime.fromISO("2022-02-02T20:30:00").setLocale("en-gb"),
      attendee: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      description: "30 minute meeting",
    };
    const { asFragment } = render(<MeetingCard meeting={meeting} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
