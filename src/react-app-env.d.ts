/// <reference types="react-scripts" />
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_WEB3_INFURA_ID?: string;
      REACT_APP_WEB3_NETWORK?: string;
      REACT_APP_WEB3_CACHE_PROVIDER?: boolean;
      REACT_APP_WEB3_CONTRACT_FACTORY_ADDRESS?: string;
      REACT_LOCALE?: string;
    }
  }
}

export {};