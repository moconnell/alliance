import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Time from "../../types/time";
import { formatTime } from "../../utils/formatDate";
import TimePicker from "./timePicker";

describe("<TimePicker />", () => {
  const testData: [string, string?, number?, Time?][] = [
    ["render correctly"],
    ["render prefix, interval correctly", "f", 15],
    [
      "render value correctly",
      undefined,
      undefined,
      { hours: 12, minutes: 30 },
    ],
  ];

  testData.forEach(([name, prefix, timeIntervalMins, value]) =>
    it(`should ${name}`, async () => {
      const { asFragment, getByTestId } = render(
        <TimePicker
          name="from"
          prefix={prefix}
          timeIntervalMins={timeIntervalMins}
          value={value}
        />
      );
      await waitFor(() =>
        expect(getByTestId("select:from")).toHaveDisplayValue(
          formatTime(value ?? { hours: 0, minutes: 0 })
        )
      );
      expect(asFragment()).toMatchSnapshot();
    })
  );

  it("should pass value on change", async () => {
    const user = userEvent.setup();
    const mockHandler = jest.fn();

    const { getByTestId } = render(
      <TimePicker name="from" onChange={mockHandler} />
    );

    await user.selectOptions(getByTestId("select:from"), ["12:30 PM"]);

    expect(mockHandler).toBeCalledWith({ hours: 12, minutes: 30 });
  });

  it("should handle missing onchange handler", async () => {
    const user = userEvent.setup();
    const mockHandler = jest.fn();

    const { getByTestId } = render(<TimePicker name="from" />);

    await user.selectOptions(getByTestId("select:from"), ["12:30 PM"]);

    expect(mockHandler).not.toBeCalledWith({ hours: 12, minutes: 30 });
  });
});
