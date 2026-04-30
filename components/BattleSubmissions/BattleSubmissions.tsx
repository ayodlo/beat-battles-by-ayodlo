"use client";

import { useEffect, useState } from "react";

type Submission = {
  id: string;
  userId: string;
  username: string;
  battleId: string;
  fileKey: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  playbackUrl?: string;
};

type BattleSubmissionsProps = {
  battleId: string;
};

export default function BattleSubmissions({
  battleId,
}: BattleSubmissionsProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/submissions?battleId=${battleId}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          throw new Error(data.error || "Could not load submissions");
        }

        return Promise.all(
          data.submissions.map((submission: Submission) => {
            return fetch(
              `/api/submissions/playback?fileKey=${encodeURIComponent(
                submission.fileKey,
              )}`,
            )
              .then((res) => res.json())
              .then((playbackData) => ({
                ...submission,
                playbackUrl: playbackData.playbackUrl,
              }));
          }),
        );
      })
      .then((submissionsWithPlaybackUrls) => {
        setSubmissions(submissionsWithPlaybackUrls);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [battleId]);

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  if (isLoading) {
    return <p className="mt-4 text-sm text-gray-500">Loading submissions...</p>;
  }

  if (error) {
    return <p className="mt-4 text-sm text-red-500">{error}</p>;
  }

  if (!submissions.length) {
    return <p className="mt-4 text-sm text-gray-500">No submissions yet.</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {submissions.map((submission) => (
        <article
          key={submission.id}
          className="rounded-md border border-gray-200 p-4"
        >
          <p className="font-semibold">{submission.fileName}</p>

          <p className="mt-1 text-sm text-gray-700">
            by <span className="font-medium">{submission.username}</span>
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Submitted {formatDate(submission.createdAt)}
          </p>

          <audio controls className="mt-4 w-full">
            <source src={submission.playbackUrl} type={submission.mimeType} />
            Your browser does not support the audio element.
          </audio>
        </article>
      ))}
    </div>
  );
}
