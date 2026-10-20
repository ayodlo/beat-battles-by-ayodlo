import { render, screen } from "@testing-library/react";
import BattleSubmissions from "./BattleSubmissions";

const mockSubmissions = [
  {
    id: "submission-123",
    userId: "user-123",
    battleId: "battle-1",
    fileKey: "submissions/test/midnight-drift.wav",
    fileUrl: "",
    fileName: "midnight-drift.wav",
    fileSize: 1000,
    username: "DevonBeats",
    createdAt: "2026-05-13T12:00:00Z",
    playbackUrl: "https://example.com/audio/midnight-drift.wav",
    mimeType: "audio/wav",
  },
  {
    id: "submission-456",
    userId: "user-456",
    battleId: "battle-1",
    fileKey: "submissions/test/dark-trap-bounce.mp3",
    fileUrl: "",
    fileName: "dark-trap-bounce.mp3",
    fileSize: 1000,
    username: "808King",
    createdAt: "2026-05-12T18:30:00Z",
    playbackUrl: "https://example.com/audio/dark-trap-bounce.mp3",
    mimeType: "audio/mpeg",
  },
];

describe("BattleSubmissions", () => {
  beforeEach(() => {
    global.fetch = jest
      .fn()
      // First call: fetch submissions list
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ submissions: mockSubmissions }),
      } as unknown as Response)
      // Second call: playback URL for submission-123
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            playbackUrl: "https://example.com/audio/midnight-drift.wav",
          }),
      } as unknown as Response)
      // Third call: playback URL for submission-456
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            playbackUrl: "https://example.com/audio/dark-trap-bounce.mp3",
          }),
      } as unknown as Response);
  });

  afterEach(() => {
    jest.restoreAllMocks(); // restores original fetch, not just resets call counts
  });

  it("shows empty submissions state", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ submissions: [] }),
    } as unknown as Response);
    render(<BattleSubmissions battleId="test-battle-id" />);
    expect(await screen.findByText(/No submissions yet./i)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<BattleSubmissions battleId={""} />);
    expect(screen.getByText(/Loading submissions.../i)).toBeInTheDocument();
  });

  it("shows loaded submissions", async () => {
    render(<BattleSubmissions battleId={""} />);
    expect(await screen.findByText(/DevonBeats/i)).toBeInTheDocument();
    expect(await screen.findByText(/808King/i)).toBeInTheDocument();
  });

  it("shows error message", async () => {
    global.fetch = jest
      .fn()
      // First call: fetch submissions list
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Failed to load submissions" }),
      } as unknown as Response);
    // Second call: playback URL for submission-123
    render(<BattleSubmissions battleId={""} />);
    expect(
      await screen.findByText(/Failed to load submissions/i),
    ).toBeInTheDocument();
  });

  it("renders audio source for a submission", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            submissions: [
              {
                id: "submission-1",
                userId: "user-1",
                username: "Devon",
                battleId: "battle-1",
                fileKey: "submissions/test/audio.wav",
                fileUrl: "",
                fileName: "audio.wav",
                fileSize: 1000,
                mimeType: "audio/wav",
                createdAt: "2026-05-18T12:00:00.000Z",
              },
            ],
          }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            playbackUrl: "https://example.com/audio.wav",
          }),
      } as unknown as Response);

    render(<BattleSubmissions battleId="battle-1" />);

    await screen.findByText("audio.wav");

    const audioSource = document.querySelector("source");

    expect(audioSource).toHaveAttribute("src", "https://example.com/audio.wav");
    expect(audioSource).toHaveAttribute("type", "audio/wav");
  });

  it("fetches submissions for the provided battle id", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ submissions: [] }),
    } as unknown as Response);

    render(<BattleSubmissions battleId="battle-123" />);

    await screen.findByText(/No submissions yet/i);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/submissions?battleId=battle-123",
    );
  });

  it("fetches playback urls for each submission", async () => {
    global.fetch = jest
      .fn()
      // submissions request
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            submissions: [
              {
                id: "submission-1",
                userId: "user-1",
                username: "Devon",
                battleId: "battle-1",
                fileKey: "submissions/test/audio.wav",
                fileUrl: "",
                fileName: "audio.wav",
                fileSize: 1000,
                mimeType: "audio/wav",
                createdAt: "2026-05-18T12:00:00.000Z",
              },
            ],
          }),
      } as unknown as Response)

      // playback request
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            playbackUrl: "https://example.com/audio.wav",
          }),
      } as unknown as Response);

    render(<BattleSubmissions battleId="battle-1" />);

    await screen.findByText("audio.wav");

    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      "/api/submissions/playback?fileKey=submissions%2Ftest%2Faudio.wav",
    );
  });
});

/*Worth testing
// Loading states
// Empty states
// Auth states
// Conditional rendering
// Buttons disabled/enabled
// Voting restrictions
// Error messages
// Submission success states

// Usually NOT worth testing
// Pure presentational spacing/styling
// Static text sections
// Tailwind classes
// Simple wrappers/containers
*/
