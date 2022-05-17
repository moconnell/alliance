import React, { createContext, useContext } from "react";
import { useWeb3 } from "../hooks";
import { web3InitialState } from "../reducers";

const Web3Context = createContext(web3InitialState);

interface Web3ContextProviderProps {
  children: React.ReactNode;
}

const Web3ContextProvider = ({ children }: Web3ContextProviderProps) => {
  const web3ProviderState = useWeb3();

  return (
    <Web3Context.Provider value={web3ProviderState}>
      {children}
    </Web3Context.Provider>
  );
};

export function useWeb3Context() {
  return useContext(Web3Context);
}

export default Web3ContextProvider;
