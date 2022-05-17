import { renderHook, waitFor } from "@testing-library/react";
// import { exec } from "child_process";
import { ethers } from "ethers";
import { useWeb3Context } from "../context/Web3Context";
import {
  Calendar,
  CalendarFactory,
  CalendarFactory__factory,
  Calendar__factory,
} from "../typechain-types";
import { useCalendar } from "./useCalendar";

jest.mock("../context/Web3Context");
jest.mock("../typechain-types", () => ({
  ...jest.requireActual("../typechain-types"),
}));
jest.mock("ethers");

describe("useCalendar", () => {
  const address = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
  const provider = new ethers.providers.JsonRpcProvider();
  const mockRpcFetchFunc = jest.fn();
  const web3Provider = new ethers.providers.Web3Provider(mockRpcFetchFunc);
  const signer = new ethers.providers.JsonRpcSigner("", provider, address);

  // let containerId: string;

  // beforeAll(async () => {
  //   exec(
  //     "docker run --rm -d -p 8545:8545 bishbashbosh/alliance:latest",
  //     (error, stdout, stderr) => {
  //       if (error) {
  //         console.error(`error: ${error.message}`);
  //       } else if (stderr) {
  //         console.error(`stderr: ${stderr}`);
  //       } else {
  //         console.log(`container running: ${stdout}`);
  //         containerId = stdout;
  //       }
  //     }
  //   );
  // });

  beforeAll(async () => {});

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  // afterAll(async () => {
  //   if (!containerId) return;

  //   exec(`docker stop ${containerId}`, (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`error: ${error.message}`);
  //     } else if (stderr) {
  //       console.error(`stderr: ${stderr}`);
  //     } else {
  //       console.log(`container stopped: ${stdout}`);
  //     }
  //   });
  // });

  it("should have calendar", async () => {
    (useWeb3Context as jest.Mock).mockImplementation(() => ({
      address,
      signer,
      web3Provider,
    }));

    jest
      .spyOn(CalendarFactory__factory.prototype, "connect")
      .mockImplementation(
        jest.fn().mockImplementation(() => ({
          userToCalendar: jest.fn().mockResolvedValue("0xAddress"),
        }))
      );

    jest
      .spyOn(Calendar__factory.prototype, "connect")
      .mockImplementation(jest.fn().mockImplementation(() => ({})));

    const {
      result: {
        current: { hasCalendar },
      },
    } = renderHook(() => useCalendar());

    await waitFor(() => expect(hasCalendar).toBeTruthy());
  });
});
