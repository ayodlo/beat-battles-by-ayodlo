import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SectionContainer from "@/components/SectionContainer/SectionContainer";
import SectionHeading from "@/components/SectionHeading/SectionHeading";

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
    <SectionContainer>
      <div className="rounded-3xl border border-neutral-300 bg-neutral-50 p-6 sm:p-8 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:p-10 dark:border-white/10 dark:bg-white/[0.03]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-white/40">
            Latest Winner
          </p>

          <SectionHeading>
            {latestWinner.username || "Unknown Producer"}
          </SectionHeading>

          <p className="mt-4 text-neutral-500 dark:text-white/60">
            Winner of{" "}
            <span className="font-semibold text-black dark:text-white">
              {latestWinner.battle.title}
            </span>
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-300 bg-white p-5 lg:mt-0 dark:border-white/10 dark:bg-black">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-white/40">
            Winning Beat
          </p>

          <p className="mt-3 font-semibold text-black dark:text-white">
            {latestWinner.fileName}
          </p>

          <p className="mt-2 text-sm text-neutral-500 dark:text-white/60">
            {latestWinner.votes.length} vote
            {latestWinner.votes.length === 1 ? "" : "s"}
          </p>

          <Link
            href={`/past-battles/${latestWinner.battle.slug}`}
            className="mt-5 inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            View Results
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}
