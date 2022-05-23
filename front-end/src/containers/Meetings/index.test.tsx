import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Meetings from "./index";
import { useCalendar } from "../../hooks";
import { DateTime } from "luxon";
import Meeting from "src/types/meeting";
import { expectsResolvedDragConstraints } from "framer-motion/types/gestures/drag/VisualElementDragControls";

jest.mock("../../hooks");
jest.mock("../../components/Calendar", () => () => "((Calendar))");

describe("<Meetings />", () => {
  const mockGetMeetings = jest.fn();

  beforeEach(() => mockGetMeetings.mockReset());
  afterAll(() => mockGetMeetings.mockRestore());

  const testData: [string, Meeting[]?][] = [
    ["render no meetings correctly"],
    [
      "render meetings correctly",
      [
        {
          date: DateTime.fromISO("2022-02-02T20:00:00").setLocale("en-gb"),
          endDate: DateTime.fromISO("2022-02-02T20:30:00").setLocale("en-gb"),
          attendee: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          description: "30 minute meeting",
        },
      ],
    ],
  ];

  testData.forEach(([name, meetings]) =>
    it(`should ${name}`, async () => {
      (useCalendar as jest.Mock).mockImplementation(() => {
        return {
          calendar: {},
          getMeetings: mockGetMeetings,
        };
      });

      mockGetMeetings.mockImplementation(() => meetings);

      const { asFragment, getByText } = render(
        <MemoryRouter>
          <Meetings />
        </MemoryRouter>
      );

      await waitFor(() =>
        expect(getByText(meetings?.at(0)?.attendee ?? "Times shown in local time")).toBeInTheDocument()
      );

      expect(asFragment()).toMatchSnapshot();
    })
  );
});

jest.clearAllMocks();
