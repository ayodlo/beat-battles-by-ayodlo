import { render, screen } from "@testing-library/react";
import GetInTouch from "./GetInTouch";

describe("GetInTouch", () => {
  render(<GetInTouch />);
  it("should render GetInTouch", () => {
    expect(screen.getByText(/Get in touch/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/theekidfresco@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Socials/i)).toBeInTheDocument();
    expect(screen.getAllByText(/@ayodlobeats/i).length).toBe(2);
    expect(screen.getByText(/Instagram/i)).toBeInTheDocument();
    expect(screen.getByText(/X/i)).toBeInTheDocument();
  });
});
