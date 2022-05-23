import { render } from "@testing-library/react";
import Preferences from "./index";
import { createMemoryHistory } from "history";
import { useCalendar } from "../../hooks";
import { Router, Route, Routes } from "react-router-dom";
import { Fragment } from "react";
import { web3InitialState } from "../../reducers";

const PROFILE_PATH = "/profile";
const ROOT_PATH = "/";
const MOCK_INPUT = "((Input))";
const MOCK_HOME = "((Home))";

jest.mock("react-hook-form", () => {
  return {
    ...jest.requireActual("react-hook-form"),
    useForm: () => {
      return { handleSubmit: jest.fn(), reset: jest.fn() };
    },
  };
});
jest.mock("../../hooks");
jest.mock("../../components/Input", () => () => MOCK_INPUT);

describe("<Preferences />", () => {
  const mockSetProfileAvailability = jest.fn();

  afterEach(() => jest.resetAllMocks());
  afterAll(() => jest.restoreAllMocks());

  const testData: [string, string, string?][] = [
    [
       "render correctly",
       PROFILE_PATH,
       "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
    ],
    [
       "redirect to home page",
       ROOT_PATH,
    ],
  ];

  testData.forEach(([ name, expectedRoute, address ]) =>
    it(`should ${name}`, () => {
      (useCalendar as jest.Mock).mockImplementation(() => {
        return {
          address,
          availablility: {},
          profile: {},
          setProfileAvailability: mockSetProfileAvailability,
        };
      });
      
      const history = createMemoryHistory();
      history.push(PROFILE_PATH);

      const { asFragment } = render(
        <Router location={history.location} navigator={history}>
          <Routes>
            <Route path={PROFILE_PATH} element={<Preferences />} />
            <Route
              path={ROOT_PATH}
              element={<Fragment>{MOCK_HOME}</Fragment>}
            />
            <Route element={<Fragment>No route match</Fragment>} />
          </Routes>
        </Router>
      );

      expect(history.location.pathname).toBe(expectedRoute);
      expect(asFragment()).toMatchSnapshot();
    })
  );
});
