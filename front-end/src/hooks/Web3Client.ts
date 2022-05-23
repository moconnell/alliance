import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useEffect, useReducer, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { Web3ProviderState, web3InitialState, web3Reducer } from "../reducers";

const getWeb3Modal = () => {
  if (typeof window === "undefined") return null;

  const {
    REACT_APP_WEB3_CACHE_PROVIDER,
    REACT_APP_WEB3_INFURA_ID,
    REACT_APP_WEB3_NETWORK,
  } = process.env;

  return new Web3Modal({
    network: REACT_APP_WEB3_NETWORK,
    cacheProvider: REACT_APP_WEB3_CACHE_PROVIDER,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: REACT_APP_WEB3_INFURA_ID,
        },
      },
    },
  });
};

export type Web3Client = Web3ProviderState & {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

export const useWeb3 = () => {
  const [state, dispatch] = useReducer(web3Reducer, web3InitialState);
  const { provider, web3Provider, address, network, signer } = state;
  const web3Modal = useMemo(() => getWeb3Modal(), []);

  const connect = useCallback(async () => {
    try {
      if (!web3Modal) {
        console.error("Cannot connect: no Web3Modal");
        return;
      }

      const provider = await web3Modal.connect();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      const network = await web3Provider.getNetwork();

      dispatch({
        type: "SET_WEB3_PROVIDER",
        provider,
        web3Provider,
        address,
        network,
        signer,
      });
    } catch (e) {
      console.log("connect error", e);
    }
  }, [web3Modal]);

  const disconnect = useCallback(async () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      dispatch({
        type: "RESET_WEB3_PROVIDER",
      });
    } else {
      console.error("No Web3Modal");
    }
  }, [provider, web3Modal]);

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connect();
    }
  }, [connect, web3Modal]);

  // EIP-1193 events
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        dispatch({
          type: "SET_ADDRESS",
          address: accounts[0],
        });
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        if (typeof window !== "undefined") {
          console.log("switched to chain...", _hexChainId);
          window.location.reload();
        } else {
          console.log("window is undefined");
        }
      };

      const handleDisconnect = (error: { code: number; message: string }) => {
        // eslint-disable-next-line no-console
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  return {
    provider,
    web3Provider,
    address,
    network,
    signer,
    connect,
    disconnect,
  } as Web3Client;
};
