import React from "react";
import { render } from "@testing-library/react";
import Home from "./Home";

test("renders correctly", () => {
  const { getByText } = render(<Home />);
  const element = getByText(/what did you eat/i);
  expect(element).toBeInTheDocument();
});
