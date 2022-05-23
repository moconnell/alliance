import { renderHook, waitFor } from "@testing-library/react";
// import { Docker } from "docker-cli-js";
import { useCalendar } from "./useCalendar";

describe("useCalendar", () => {
  // let port = 10545;

  // beforeAll(async () => {
  //   const docker = new Docker();
  //   await docker.command(`run --rm -d -p ${port++}:7545 bishbashbosh/alliance`);
  // });

  // afterAll(() => {});

  it("should have calendar", async () => {
    const {
      result: {
        current: { hasCalendar },
      },
    } = renderHook(() => useCalendar());

    await waitFor(() => expect(hasCalendar).toBeFalsy());
  });
});
