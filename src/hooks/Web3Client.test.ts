import { renderHook, waitFor, screen } from "@testing-library/react";
import { useWeb3 } from "./Web3Client";

describe("useWeb3", () => {
//   beforeEach(async () => {});

  it("should render wallet connect dialog", async () => {
    const { result } = renderHook(() => useWeb3());
    await waitFor(() => expect(result.current).not.toBeUndefined());
    expect(screen.getByText("WalletConnect")).toBeInTheDocument();
  });
});
