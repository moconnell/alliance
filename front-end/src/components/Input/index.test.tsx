import { useFormContext } from "react-hook-form";
import { renderWithFormProvider } from "../../testUtils";
import Input from "./index";

jest.mock("./availabilityInput", () => () => "((AvailabilityInput))");
jest.mock("./profileInput", () => () => "((ProfileInput))");
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useFormContext: jest.fn(),
}));

describe("<Input />", () => {
  it("should render correctly", async () => {
    useFormContext.mockReturnValue({
      formState: { isDirty: false, isSubmitting: false, isValid: false },
    });

    const { asFragment } = renderWithFormProvider(<Input />);
    expect(asFragment()).toMatchSnapshot();
  });

  const testData = [
    { isDirty: true, isSubmitting: false, isValid: true, disabled: false },
    { isDirty: false, isSubmitting: false, isValid: true, disabled: true },
    { isDirty: true, isSubmitting: false, isValid: false, disabled: true },
    { isDirty: true, isSubmitting: true, isValid: true, disabled: true },
  ];

  testData.forEach(({ isDirty, isSubmitting, isValid, disabled }) => {
    beforeEach(() => {
      useFormContext.mockReturnValue({
        formState: { isDirty, isSubmitting, isValid },
      });
    });

    it("save button should be clickable", async () => {
      const { findByRole } = renderWithFormProvider(<Input />);
      const saveButton = await findByRole("button");
      const exp = expect(saveButton);
      if (disabled) {
        exp.toBeDisabled();
      } else {
        exp.toHaveAttribute("disabled", "");
      }
    });
  });
});
