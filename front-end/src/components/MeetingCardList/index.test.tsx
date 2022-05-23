import { render } from "@testing-library/react";
import MeetingCardList from "./index";

jest.mock("../MeetingCard", () => () => `((MeetingCard))`);

describe("<MeetingCardList />", () => {
  it("should render correctly", async () => {
    const meetings = [
      {
        date: new Date(Date.parse("2022-02-02T20:00.00Z")),
        endDate: new Date(Date.parse("2022-02-02T20:30.00Z")),
        attendee: "Dave Spart",
        description: "Random meeting",
      },
    ];
    const { asFragment } = render(<MeetingCardList meetings={meetings} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
