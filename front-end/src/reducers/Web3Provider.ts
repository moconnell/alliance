import { ethers } from "ethers";

export type Web3ProviderState = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any;
  web3Provider: ethers.Provider | null | undefined;
  address: string | null | undefined;
  network: ethers.Network | null | undefined;
  signer: ethers.JsonRpcSigner | null | undefined;
  connect: (() => Promise<void>) | null;
  disconnect: (() => Promise<void>) | null;
};

export const web3InitialState: Web3ProviderState = {
  provider: null,
  web3Provider: null,
  address: null,
  network: null,
  signer: null,
  connect: null,
  disconnect: null,
};

export type Web3Action =
  | {
      type: "SET_WEB3_PROVIDER";
      provider?: Web3ProviderState["provider"];
      web3Provider?: Web3ProviderState["web3Provider"];
      address?: Web3ProviderState["address"];
      network?: Web3ProviderState["network"];
      signer?: Web3ProviderState["signer"];
    }
  | {
      type: "SET_ADDRESS";
      address?: Web3ProviderState["address"];
    }
  | {
      type: "SET_NETWORK";
      network?: Web3ProviderState["network"];
    }
  | {
      type: "RESET_WEB3_PROVIDER";
    };

export function web3Reducer(
  state: Web3ProviderState,
  action: Web3Action
): Web3ProviderState {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        network: action.network,
        signer: action.signer
      };
    case "SET_ADDRESS":
      return {
        ...state,
        address: action.address,
      };
    case "SET_NETWORK":
      return {
        ...state,
        network: action.network,
      };
    case "RESET_WEB3_PROVIDER":
      return web3InitialState;
  }
}
