import { render } from "@testing-library/react";
import { useWeb3Context } from "../../context/Web3Context";
import { web3InitialState } from "../../reducers";
import Web3Button from "./index";

jest.mock("../../context/Web3Context");

describe("<Web3Button />", () => {
  const mockConnect = jest.fn();
  const mockDisconnect = jest.fn();

  beforeEach(() => {
    mockConnect.mockReset();
    mockDisconnect.mockReset();
  });
  afterAll(() => {
    mockConnect.mockRestore();
    mockDisconnect.mockRestore();
  });

  const testData = [
    web3InitialState,
    { ...web3InitialState, connect: mockConnect },
    { ...web3InitialState, disconnect: mockDisconnect, web3Provider: {} },
    { ...web3InitialState, web3Provider: {} },
  ];

  testData.forEach((web3Client) =>
    it("should render correctly", async () => {
      (useWeb3Context as jest.Mock).mockReturnValue(web3Client);

      const { asFragment } = render(<Web3Button />);
      expect(asFragment()).toMatchSnapshot();
    })
  );
});

jest.clearAllMocks();
