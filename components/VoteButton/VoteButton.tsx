"use client";

import { useState } from "react";

type VoteButtonProps = {
  battleId: string;
  submissionId: string;
  submissionUserId: string;
  currentUserId: string | null;
  userVoteSubmissionId: string | null;
  isVotingOpen: boolean;
  initialVoteCount: number;
};

export default function VoteButton({
  battleId,
  submissionId,
  submissionUserId,
  currentUserId,
  userVoteSubmissionId,
  isVotingOpen,
  initialVoteCount,
}: VoteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isOwnSubmission = currentUserId === submissionUserId;
  const isCurrentVote = userVoteSubmissionId === submissionId;
  const hasVoted = Boolean(userVoteSubmissionId);

  const isDisabled =
    !currentUserId || !isVotingOpen || isOwnSubmission || isCurrentVote;

  const label = !currentUserId
    ? "Sign in to vote"
    : !isVotingOpen
      ? "Voting Closed"
      : isOwnSubmission
        ? "Your Beat"
        : isCurrentVote
          ? "Current Vote"
          : hasVoted
            ? "Change Vote"
            : "Vote";

  function handleVote() {
    setIsLoading(true);
    setErrorMessage("");

    fetch("/api/votes/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ battleId, submissionId }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Vote failed");
          });
        }

        return res.json();
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={isDisabled || isLoading}
          onClick={handleVote}
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
        >
          {isLoading ? "Saving..." : label}
        </button>

        <p className="text-sm text-gray-500">
          {initialVoteCount} {initialVoteCount === 1 ? "vote" : "votes"}
        </p>
      </div>

      {errorMessage ? (
        <p className="text-sm font-medium text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}
