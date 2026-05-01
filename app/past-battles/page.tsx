import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PastBattlesPage() {
  const battles = await prisma.battle.findMany({
    where: {
      status: "closed",
    },
    include: {
      submissions: {
        include: {
          votes: true,
        },
      },
    },
  });

  return (
    <main className="bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Archive
        </p>

        <h1 className="mt-3 text-4xl font-bold">Past Battles</h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Revisit previous beat battles, listen to submissions, and view the
          final rankings.
        </p>

        <div className="mt-10 grid gap-6">
          {battles.length > 0 ? (
            battles.map((battle) => {
              const sortedSubmissions = battle.submissions
                .slice()
                .sort((a, b) => b.votes.length - a.votes.length);

              const winner =
                battle.submissions.find((s) => s.placement === 1) ||
                sortedSubmissions[0];

              return (
                <Link
                  key={battle.id}
                  href={`/past-battles/${battle.slug}`}
                  className="rounded-2xl border border-border bg-card p-6 text-card-foreground transition hover:border-foreground"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-red-600">
                        Status: Closed
                      </p>

                      <h2 className="mt-2 text-2xl font-bold">
                        {battle.title}
                      </h2>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Voting ended: {battle.endsAt?.toLocaleString() || "N/A"}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {battle.submissions.length} submission
                      {battle.submissions.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="mt-6 rounded-xl border border-border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Winner</p>

                    <p className="mt-1 text-lg font-semibold">
                      {winner?.username || "No winner"}
                    </p>

                    {winner ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {winner.votes.length} vote
                        {winner.votes.length === 1 ? "" : "s"}
                      </p>
                    ) : null}
                  </div>

                  <p className="mt-5 text-sm font-semibold">View results →</p>
                </Link>
              );
            })
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground">
              <h2 className="text-xl font-bold">No past battles yet</h2>

              <p className="mt-2 text-muted-foreground">
                Closed battles will appear here once you close them from the
                admin dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
