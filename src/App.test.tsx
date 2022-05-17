import { render } from "@testing-library/react";
import App from "./App";

jest.mock("./components/Button", () => () => "((Button))");
jest.mock("./components/Calendar", () => () => "((Calendar))");
jest.mock("./components/Header", () => () => "((Header))");
jest.mock("./components/Input", () => () => "((Input))");
jest.mock("./components/MeetingCardList", () => () => "((MeetingCardList))");
jest.mock("./components/Modal", () => () => "((Modal))");
jest.mock(
  "./components/Modal/components/LoadingTransaction",
  () => () => "((LoadingTransaction))"
);
jest.mock("./components/TimeList", () => () => "((TimeList))");
jest.mock("./containers/Home", () => () => "((Home))");
jest.mock("./containers/Preferences", () => () => "((Preferences))");

describe("<App />", () => {
  it("should render correctly", async () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});
