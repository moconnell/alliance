import { render } from "@testing-library/react";
import Modal from "./index";

describe("<Modal />", () => {
  it("should render correctly", async () => {
    const closeModal = jest.fn();
    const { asFragment } = render(<Modal closeModal={closeModal} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
