import { renderWithFormProvider } from "../../testUtils";
import AvailabilityInfo from "../../types/availabilityInfo";
import AvailabilityInput from "./availabilityInput";

jest.mock("../AvailableDays", () => () => "((AvailableDays))");

describe("<AvailabilityInput />", () => {
  const testData = [
    {
      location: "London",
      timeZone: "Europe/London",
      from: { hours: 9, minutes: 30 },
      to: { hours: 12, minutes: 0 },
    },
    {
      from: { hours: 9, minutes: 30 },
    },
    {
      to: { hours: 15, minutes: 30 },
    },
    {}
  ];

  testData.forEach((defaultValues: AvailabilityInfo) =>
    it("should render correctly", async () => {
      const { asFragment } = renderWithFormProvider(
        <AvailabilityInput />,
        defaultValues
      );

      expect(asFragment()).toMatchSnapshot();
    })
  );
});
