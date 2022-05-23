import { fireEvent, render, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { DateTime } from "luxon";
import { Route, Router, Routes } from "react-router-dom";
import DaysOfWeek from "../../types/daysOfWeek";
import { dateTimeRange } from "../../testUtils";
import { useCalendar } from "../../hooks";
import AvailabilityInfo from "../../types/availabilityInfo";
import ProfileInfo from "../../types/profileInfo";
import Book from "./index";
import { act } from "react-dom/test-utils";
import { useToast } from "@chakra-ui/react";

const HARDHAT_ACC_0 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const HARDHAT_ACC_1 = "0x23dB4a08f2272df049a4932a4Cc3A6Dc1002B33E";
const MR_BOJANGLES_PROFILE_AVAILABILITY: [ProfileInfo, AvailabilityInfo] = [
  { username: "mr_bojangles", description: "legend" },
  {
    location: "The Big Smoke",
    timeZone: "Europe/London",
    availableDays: DaysOfWeek.MonFri,
  },
];

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: jest.fn(),
}));
jest.mock("../../hooks");
jest.mock("../../components/Calendar", () => () => "((Calendar))");
jest.mock("../../components/Modal", () => () => "((ModalComponent))");
jest.mock(
  "../../components/Modal/components/LoadingTransaction",
  () => () => "((LoadingTransaction))"
);

describe("<Book />", () => {
  const mockBookMeeting = jest.fn();
  const mockGetProfileAvailability = jest.fn();
  const mockGetAvailableTimes = jest.fn();

  const renderWithRouter = (calendarAddress?: string) => {
    const history = createMemoryHistory();
    history.push(calendarAddress ? `/book/${calendarAddress}` : "/book");

    return render(
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route path="/book" element={<Book />}>
            <Route path="/book/:calendarAddress" element={<Book />} />
          </Route>
        </Routes>
      </Router>
    );
  };

  afterEach(() => jest.resetAllMocks());
  afterAll(() => jest.restoreAllMocks());

  const testData: [
    string,
    string,
    string?,
    string?,
    [ProfileInfo, AvailabilityInfo]?,
    DateTime[]?
  ][] = [
    [
      "render correctly",
      "container:profile",
      HARDHAT_ACC_0,
      HARDHAT_ACC_1,
      MR_BOJANGLES_PROFILE_AVAILABILITY,
      dateTimeRange(9, 14),
    ],
    ["render invalid url error", "container:invalid-url"],
    [
      "render invalid calendar error",
      "container:invalid-calendar",
      HARDHAT_ACC_0,
      HARDHAT_ACC_0,
    ],
  ];

  testData.forEach(
    ([
      name,
      testId,
      address,
      calendarAddress,
      profileAvailability,
      availableTimes,
    ]) =>
      it(`should ${name}`, async () => {
        (useCalendar as jest.Mock).mockImplementation(() => {
          return {
            address,
            bookMeeting: mockBookMeeting,
            getProfileAvailability: mockGetProfileAvailability,
            getAvailableTimes: mockGetAvailableTimes,
          };
        });

        mockGetProfileAvailability.mockResolvedValue(profileAvailability);
        mockGetAvailableTimes.mockResolvedValue(availableTimes);

        const { asFragment, getByTestId } = renderWithRouter(calendarAddress);

        await waitFor(() => expect(getByTestId(testId)).toBeInTheDocument());

        expect(asFragment()).toMatchSnapshot();
      })
  );

  it("should book meeting", async () => {
    (useCalendar as jest.Mock).mockImplementation(() => {
      return {
        address: HARDHAT_ACC_0,
        bookMeeting: mockBookMeeting,
        getProfileAvailability: mockGetProfileAvailability,
        getAvailableTimes: mockGetAvailableTimes,
      };
    });

    mockGetProfileAvailability.mockResolvedValue(
      MR_BOJANGLES_PROFILE_AVAILABILITY
    );
    const mockTimes = dateTimeRange(9, 17, 30);
    mockGetAvailableTimes.mockResolvedValue(mockTimes);

    const { getByTestId, getByText } = renderWithRouter(HARDHAT_ACC_1);

    await waitFor(() =>
      expect(getByTestId("container:profile")).toBeInTheDocument()
    );

    act(() => {
      fireEvent.click(getByText("10:30 AM"));
    });

    await waitFor(() =>
      expect(getByTestId("button:book-meeting")).toBeEnabled()
    );

    act(() => {
      fireEvent.click(getByTestId("button:book-meeting"));
    });

    await waitFor(() =>
      expect(getByTestId("container:booking-complete")).toBeInTheDocument()
    );

    expect(mockBookMeeting).toHaveBeenCalledWith(
      HARDHAT_ACC_1,
      mockTimes[3],
      60
    );
  });

  it("should show toast on bookMeeting error", async () => {
    (useCalendar as jest.Mock).mockImplementation(() => {
      return {
        address: HARDHAT_ACC_0,
        bookMeeting: mockBookMeeting,
        getProfileAvailability: mockGetProfileAvailability,
        getAvailableTimes: mockGetAvailableTimes,
      };
    });

    const mockToast = jest.fn();
    (useToast as jest.Mock).mockImplementation(() => mockToast);

    mockGetProfileAvailability.mockResolvedValue(
      MR_BOJANGLES_PROFILE_AVAILABILITY
    );

    const mockTimes = dateTimeRange(9, 17, 30);
    mockGetAvailableTimes.mockResolvedValue(mockTimes);

    const errorMessage = "Ooops, looks like something went wrong there :/";
    mockBookMeeting.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const { getByRole, getByTestId, getByText } =
      renderWithRouter(HARDHAT_ACC_1);

    await waitFor(() =>
      expect(getByTestId("container:profile")).toBeInTheDocument()
    );

    act(() => {
      fireEvent.click(getByText("10:30 AM"));
    });

    await waitFor(() =>
      expect(getByTestId("button:book-meeting")).toBeEnabled()
    );

    act(() => {
      fireEvent.click(getByTestId("button:book-meeting"));
    });

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ description: errorMessage })
      )
    );
  });
});
