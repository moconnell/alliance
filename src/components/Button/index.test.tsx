import { render } from "@testing-library/react";
import Button from "./index";

describe("<Button />", () => {
  it("should render correctly", async () => {
    const { asFragment } = render(<Button />);
    expect(asFragment()).toMatchSnapshot();
  });
});
