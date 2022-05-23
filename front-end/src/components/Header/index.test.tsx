import { render } from "@testing-library/react";
import Header from "./index";

jest.mock("../Web3Button", () => () => "((Web3Button))");

describe("<Header />", () => {
  it("should render correctly", async () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
});
