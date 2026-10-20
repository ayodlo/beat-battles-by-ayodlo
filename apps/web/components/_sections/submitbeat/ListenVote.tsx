import { auth } from "@clerk/nextjs/server";
import SectionContainer from "@/components/SectionContainer/SectionContainer";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import {
  getSubmissionsWithVotes,
  query,
  type Battle,
  type Vote,
} from "@/lib/db";
import VoteButton from "@/components/VoteButton/VoteButton";

export default async function ListenVote() {
  const { userId } = await auth();

  const [battle] = await query<Battle>(
    `SELECT * FROM "Battle"
     WHERE "status" = 'open'
     ORDER BY "createdAt" DESC
     LIMIT 1`,
  );

  if (!battle) {
    return (
      <SectionContainer>
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-semibold text-muted-foreground">Entries</p>
          <SectionHeading>Listen and vote</SectionHeading>
          <p className="text-muted-foreground">No active battle found.</p>
        </div>
      </SectionContainer>
    );
  }

  const submissions =
    (await getSubmissionsWithVotes([battle.id], "asc")).get(battle.id) ?? [];

  const [userVote] = userId
    ? await query<Vote>(
        `SELECT * FROM "Vote" WHERE "battleId" = $1 AND "userId" = $2`,
        [battle.id, userId],
      )
    : [];

  const isVotingOpen = battle.status === "open";

  return (
    <SectionContainer>
      <section className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">Entries</p>
          <SectionHeading>Listen and vote</SectionHeading>
          <p className="text-muted-foreground">
            Every beat gets heard. Every vote counts.
          </p>
        </div>

        {submissions.length === 0 ? (
          <p className="text-muted-foreground">No submissions yet.</p>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <article
                key={submission.id}
                className="space-y-4 rounded-2xl border border-border bg-card p-5 text-card-foreground"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold">{submission.fileName}</h3>

                  <p className="text-sm text-muted-foreground">
                    by {submission.username || "Anonymous"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Submitted {new Date(submission.createdAt).toLocaleString()}
                  </p>
                </div>

                <audio
                  controls
                  src={`/api/playback?fileKey=${encodeURIComponent(
                    submission.fileKey,
                  )}`}
                  className="w-full"
                />

                <VoteButton
                  battleId={battle.id}
                  submissionId={submission.id}
                  submissionUserId={submission.userId}
                  currentUserId={userId}
                  userVoteSubmissionId={userVote?.submissionId ?? null}
                  isVotingOpen={isVotingOpen}
                  initialVoteCount={submission.votes.length}
                />
              </article>
            ))}
          </div>
        )}
      </section>
    </SectionContainer>
  );
}
