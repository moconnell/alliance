import React from "react";
import { useWeb3Context } from "../../context/Web3Context";
import Button from "../Button";

interface ConnectProps {
  connect: (() => Promise<void>) | null;
}

const ConnectButton = ({ connect }: ConnectProps) => {
  return connect ? (
    <Button onClick={connect}>Connect Wallet</Button>
  ) : (
    <Button>Loading...</Button>
  );
};

interface DisconnectProps {
  title?: string;
  disconnect: (() => Promise<void>) | null;
}

const DisconnectButton = ({ title, disconnect }: DisconnectProps) => {
  return disconnect ? (
    <Button title={title} onClick={disconnect}>
      Disconnect Wallet
    </Button>
  ) : (
    <Button>Loading...</Button>
  );
};

const Web3Button = () => {
  const { address, network, web3Provider, connect, disconnect } =
    useWeb3Context();

  return web3Provider ? (
    <DisconnectButton
      disconnect={disconnect}
      title={`Disconnect ${network?.name} ${address}`}
    />
  ) : (
    <ConnectButton connect={connect} />
  );
};

export default Web3Button;
