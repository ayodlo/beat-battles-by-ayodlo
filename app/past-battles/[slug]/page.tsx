import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PastBattleDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PastBattleDetailPage({
  params,
}: PastBattleDetailPageProps) {
  const { slug } = await params;

  const battle = await prisma.battle.findUnique({
    where: {
      slug,
    },
    include: {
      submissions: {
        include: {
          votes: true,
        },
      },
    },
  });

  if (!battle) {
    notFound();
  }

  const sortedSubmissions = battle.submissions
    .slice()
    .sort((a, b) => b.votes.length - a.votes.length);

  const winner = sortedSubmissions[0];

  return (
    <main className="bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Battle Results
        </p>

        <h1 className="mt-3 text-4xl font-bold">{battle.title}</h1>

        <p className="mt-3 text-muted-foreground">
          Final rankings, votes, and submissions from this battle.
        </p>

        {winner ? (
          <section className="mt-10 rounded-2xl border border-yellow-500 bg-yellow-500/10 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600 dark:text-yellow-400">
              🏆 Winner
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {winner.username || "Unknown Producer"}
            </h2>

            <p className="mt-2 text-muted-foreground">
              {winner.votes.length} vote{winner.votes.length === 1 ? "" : "s"}
            </p>

            <audio
              className="mt-5 w-full"
              controls
              src={`/api/playback?fileKey=${encodeURIComponent(
                winner.fileKey,
              )}`}
            />
          </section>
        ) : (
          <section className="mt-10 rounded-2xl border border-border bg-card p-6 text-card-foreground">
            <h2 className="text-2xl font-bold">No winner</h2>

            <p className="mt-2 text-muted-foreground">
              This battle did not receive any submissions.
            </p>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Final Rankings</h2>

          <div className="mt-6 grid gap-6">
            {sortedSubmissions.length > 0 ? (
              sortedSubmissions.map((submission, index) => {
                const rank = index + 1;
                const isWinner = rank === 1;

                return (
                  <article
                    key={submission.id}
                    className={`rounded-2xl border p-6 ${
                      isWinner
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-border bg-card text-card-foreground"
                    }`}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-muted-foreground">
                            Rank #{rank}
                          </p>

                          {isWinner ? (
                            <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
                              Winner
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-2 text-xl font-bold">
                          {submission.username || "Unknown Producer"}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {submission.fileName}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-muted-foreground">
                        {submission.votes.length} vote
                        {submission.votes.length === 1 ? "" : "s"}
                      </p>
                    </div>

                    <audio
                      className="mt-5 w-full"
                      controls
                      src={`/api/playback?fileKey=${encodeURIComponent(
                        submission.fileKey,
                      )}`}
                    />
                  </article>
                );
              })
            ) : (
              <p className="text-muted-foreground">
                No submissions were added to this battle.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
