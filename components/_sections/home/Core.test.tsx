import { render, screen } from "@testing-library/react";
import Core from "./Core";

describe("Core", () => {
  it("should display core text", async () => {
    render(<Core />);
    expect(
      await screen.findByText(/How to join a Beat Battle/i),
    ).toBeInTheDocument();
    expect(await screen.findByText(/Vote on beats/i)).toBeInTheDocument();
    expect(await screen.findByText(/Vote on beats/i)).toBeInTheDocument();
    expect(
      await screen.findByText(
        /Check out previous winners and revisit past competitions./i,
      ),
    ).toBeInTheDocument();
  });
});
