import { render } from "@testing-library/react";
import Today from "./Today";

test("renders correctly", () => {
  const { getByText } = render(<Today />);
  const element = getByText(/what did you eat/i);
  expect(element).toBeInTheDocument();
});
