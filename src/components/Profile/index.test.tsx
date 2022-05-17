import { render } from "@testing-library/react";
import Profile from "./index";

describe("<Profile />", () => {
  it("should render correctly", async () => {
    const profile = {
      picture: "profile.jpg",
      email: "me@mydomain.com",
      username: "user1",
      description: "A user",
    };
    const { asFragment } = render(<Profile profile={profile} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
