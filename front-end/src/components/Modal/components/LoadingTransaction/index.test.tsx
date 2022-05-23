import { render } from "@testing-library/react";
import LoadingTransaction from "./index";

describe("<LoadingTransaction />", () => {
  const testData = [
    {},
    {
      loading: true,
      progress: 0,
    },
    {
      loading: false,
      progress: 100,
    },
  ];

  testData.forEach((props) =>
    it("should render correctly", async () => {
      const { asFragment } = render(<LoadingTransaction {...props} />);
      expect(asFragment()).toMatchSnapshot();
    })
  );
});
