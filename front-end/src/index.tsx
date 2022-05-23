import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import App from "./App";
import theme from "./theme";
import "./theme/styles.css";
import Web3ContextProvider from "./context/Web3Context";
import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container as Element);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Web3ContextProvider>
        <App />
      </Web3ContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);
