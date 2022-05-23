import { renderHook, waitFor } from "@testing-library/react";
import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { useCalendar } from "./useCalendar";

describe("useCalendar", () => {
  let npm: ChildProcessWithoutNullStreams;

  beforeAll(() => {
    npm = spawn("cd ../back-end && concurrently start-local deploy-local");

    npm.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    npm.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    npm.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  });

  afterAll(() => {
    npm?.kill();
  });

  it("should have calendar", async () => {
    const {
      result: {
        current: { hasCalendar },
      },
    } = renderHook(() => useCalendar());

    await waitFor(() => expect(hasCalendar).toBeTruthy());
  });
});
