import { render } from "@testing-library/react";
import { useWeb3 } from "../hooks/Web3Client";
import { web3InitialState } from "../reducers";
import Web3ContextProvider from "./Web3Context";

jest.mock("../hooks/Web3Client");

describe("<Web3ContextProvider />", () => {
  it("should render correctly", async () => {
    (useWeb3 as jest.Mock).mockReturnValue({
      ...web3InitialState,
      connect: jest.fn(),
      disconnect: jest.fn(),
    });

    const { asFragment } = render(
      <Web3ContextProvider>&nbsp;</Web3ContextProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

jest.clearAllMocks();
