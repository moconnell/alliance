import {
  Web3Action,
  web3InitialState,
  Web3ProviderState,
  web3Reducer,
} from "./Web3Provider";
import { ethers } from "ethers";

jest.mock("ethers");

describe("web3Reducer", () => {
  const mockAddress = "0x1234123412341234";
  const mockProvider = jest.fn();
  const mockWeb3Provider = jest.fn();
  const mockSigner = jest.fn();

  afterEach(() => jest.resetAllMocks());
  afterAll(() => jest.restoreAllMocks());

  const testData = [
    {
      state: { ...web3InitialState, address: mockAddress },
      action: {
        type: "RESET_WEB3_PROVIDER",
      },
      expected: web3InitialState,
    },
    {
      state: web3InitialState,
      action: {
        type: "SET_ADDRESS",
        address: mockAddress,
      },
      expected: { ...web3InitialState, address: mockAddress },
    },
    {
      state: web3InitialState,
      action: {
        type: "SET_NETWORK",
        network: mockAddress,
      },
      expected: { ...web3InitialState, network: mockAddress },
    },
    {
      state: web3InitialState,
      action: {
        type: "SET_WEB3_PROVIDER",
        provider: mockProvider,
        web3Provider: mockWeb3Provider,
        address: mockAddress,
        signer: mockSigner,
      },
      expected: {
        network: undefined,
        provider: mockProvider,
        web3Provider: mockWeb3Provider,
        address: mockAddress,
        signer: mockSigner,
        connect: null,
        disconnect: null,
      },
    },
  ] as {
    state: Web3ProviderState;
    action: Web3Action;
    expected: Web3ProviderState;
  }[];

  testData.forEach(({ state, action, expected }) => {
    it(`should return expected state`, () => {
      expect(web3Reducer(state, action)).toStrictEqual(expected);
    });
  });
});
