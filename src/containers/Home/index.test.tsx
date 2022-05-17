import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useWeb3Context } from "../../context/Web3Context";
import { useCalendar } from "../../hooks";
import { Calendar } from "../../typechain-types";
import { Fragment } from "react";
import { web3InitialState } from "../../reducers";
import Home from "./index";

jest.mock("../../context/Web3Context");
jest.mock("../../hooks");
jest.mock("../../components/Web3Button", () => () => "((Web3Button))");
jest.mock("../../typechain-types");

describe("<Home />", () => {
  const testData: [string, boolean?, string?][] = [
    ["redirect to meetings page", true],
    ["redirect to profile page", false, "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968"],
    ["render correctly"],
  ];

  beforeEach(() => jest.resetAllMocks());
  afterAll(() => jest.restoreAllMocks());

  testData.forEach(([name, hasCalendar = false, address]) => {
    it(`should ${name}`, async () => {
      (useCalendar as jest.Mock).mockImplementation(() => {
        return {
          address,
          hasCalendar,
        };
      });

      const { asFragment } = render(
        <MemoryRouter>
          <Routes>
            <Route
              path="/meetings"
              element={<Fragment>Meetings page</Fragment>}
            />
            <Route
              path="/profile"
              element={<Fragment>Profile page</Fragment>}
            />
            <Route path="/" element={<Home />} />
          </Routes>
        </MemoryRouter>
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});

jest.clearAllMocks();
