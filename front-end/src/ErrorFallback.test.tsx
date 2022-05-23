import { fireEvent, render } from "@testing-library/react";
import ErrorFallback from "./ErrorFallback";

describe("<ErrorFallback />", () => {
  const mockHandler = jest.fn();

  beforeEach(() => {
    mockHandler.mockReset();
  });

  it("should render correctly", async () => {
    const { asFragment } = render(
      <ErrorFallback
        error={new Error("Ouch")}
        resetErrorBoundary={mockHandler}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should call handler on button click", async () => {
    const { getByRole } = render(
      <ErrorFallback
        error={new Error("Ouch")}
        resetErrorBoundary={mockHandler}
      />
    );

    fireEvent.click(getByRole("button"));
    expect(mockHandler).toBeCalled();
  });
});
