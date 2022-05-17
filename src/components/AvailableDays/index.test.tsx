import { fireEvent, render } from "@testing-library/react";
import { useState } from "react";
import DaysOfWeek from "../../types/daysOfWeek";
import Button from "../Button";
import AvailableDays from "./index";

const TestComponent = () => {
  const [value, setValue] = useState(DaysOfWeek.MonFri);

  return (
    <>
      <AvailableDays value={value} />
      <Button testId="button:update" onClick={() => setValue(DaysOfWeek.Monday)} />
    </>
  );
};

describe("<AvailableDays />", () => {
  it("should render correctly", async () => {
    const { asFragment } = render(<AvailableDays />);
    expect(asFragment()).toMatchSnapshot();
  });

  const testData = [
    {
      defaultValue: DaysOfWeek.Monday,
      clickText: /Tue/i,
      expectedValue: DaysOfWeek.Monday | DaysOfWeek.Tuesday,
    },
    {
      defaultValue: DaysOfWeek.MonFri,
      clickText: /Fri/i,
      expectedValue:
        DaysOfWeek.Monday |
        DaysOfWeek.Tuesday |
        DaysOfWeek.Wednesday |
        DaysOfWeek.Thursday,
    },
  ];

  testData.forEach(({ defaultValue, clickText, expectedValue }) =>
    it("should send value onChange", async () => {
      const mockHandleChange = jest.fn();
      const { getByText } = render(
        <AvailableDays value={defaultValue} onChange={mockHandleChange} />
      );
      fireEvent.click(getByText(clickText));
      expect(mockHandleChange).toHaveBeenCalledWith(expectedValue);
    })
  );

  it("should re-render after update", async () => {
    const { asFragment, getByTestId, getByText } = render(<TestComponent />);
    expect(asFragment()).toMatchSnapshot();
    
    fireEvent.click(getByText("Fri"));
    expect(asFragment()).toMatchSnapshot();

    fireEvent.click(getByTestId("button:update"));
    expect(asFragment()).toMatchSnapshot();
  });
});
