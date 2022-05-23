import { fireEvent, render } from "@testing-library/react";
import DaysOfWeek from "../../../types/daysOfWeek";
import AvailableDaysButton from "./index";

describe("<AvailableDaysButton />", () => {
  it("should render correctly", async () => {
    const { asFragment } = render(
      <AvailableDaysButton day={DaysOfWeek.Monday} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should send value on click", async () => {
    const day = DaysOfWeek.Monday;
    const selected = true;
    const mockHandler = jest.fn();

    const { getByRole } = render(
      <AvailableDaysButton
        day={day}
        onSelect={mockHandler}
        selected={selected}
      />
    );

    fireEvent.click(getByRole("button"));

    expect(mockHandler).toBeCalledWith(day, !selected);
  });

  it("should ignore click without handler", async () => {
    const { getByRole } = render(
      <AvailableDaysButton day={DaysOfWeek.Monday} />
    );
    fireEvent.click(getByRole("button"));
  });
});
