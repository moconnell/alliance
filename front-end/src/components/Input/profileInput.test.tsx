import { renderWithFormProvider } from "../../testUtils";
import ProfileInfo from "../../types/profileInfo";
import ProfileInput from "./profileInput";

describe("<ProfileInput />", () => {
  it("should render correctly", async () => {
    const defaultValues = {
      email: "me@email.com",
      username: "me again",
      description: "about me",
    } as ProfileInfo;

    const { asFragment } = renderWithFormProvider(
      <ProfileInput />,
      defaultValues
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
