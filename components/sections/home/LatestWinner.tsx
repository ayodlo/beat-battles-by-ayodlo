import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function LatestWinner() {
  const latestWinner = await prisma.submission.findFirst({
    where: {
      placement: 1,
      battle: {
        hiddenFromHistory: false,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      battle: true,
      votes: true,
    },
  });

  if (!latestWinner) {
    return null;
  }

  return (
    <section className="mx-auto mt-12 max-w-5xl px-6">
      <div className="rounded-2xl border border-neutral-300 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Latest Winner
        </p>

        <h2 className="mt-3 text-3xl font-bold">
          {latestWinner.username || "Unknown producer"}
        </h2>

        <p className="mt-2 text-neutral-500">
          Winner of {latestWinner.battle.title}
        </p>

        <p className="mt-2 text-sm text-neutral-500">{latestWinner.fileName}</p>

        <p className="mt-2 text-sm text-neutral-500">
          {latestWinner.votes.length} vote
          {latestWinner.votes.length === 1 ? "" : "s"}
        </p>

        <Link
          href={`/past-battles/${latestWinner.battle.slug}`}
          className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
        >
          View Results
        </Link>
      </div>
    </section>
  );
}
