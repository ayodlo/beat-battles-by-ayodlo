import { render, screen } from "@testing-library/react";
import GetNotified from "./GetNotified";

describe("GetNotified", () => {
  render(<GetNotified />);
  it("should render GetNotified", () => {
    expect(
      screen.getByText(
        /Get notified when new battles drop, voting opens, and winners are announced./i,
      ),
    ).toBeInTheDocument();
  });
});
