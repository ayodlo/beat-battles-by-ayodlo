import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";
import Core from "@/components/_sections/home/Core";
import Intro from "@/components/_sections/home/Intro";
import Join from "@/components/_sections/home/Join";
import Testimonials from "@/components/_sections/home/Testimonials";
import StayInTheFight from "@/components/_sections/home/GetNotified";
import GetInTouch from "@/components/_sections/home/GetInTouch";
import Questions from "@/components/_sections/home/Questions";
import LatestWinner from "@/components/_sections/home/LatestWinner";
import { query, type Battle } from "@/lib/db";

export default async function Home() {
  const [currentBattle] = await query<Battle & { submissionCount: number }>(
    `SELECT b.*,
       (SELECT COUNT(*)::int FROM "Submission" s WHERE s."battleId" = b."id") AS "submissionCount"
     FROM "Battle" b
     WHERE b."status" = 'open'
     ORDER BY b."createdAt" DESC
     LIMIT 1`,
  );

  return (
    <main className="px-6 py-8">
      <Intro />

      {currentBattle ? (
        <section className="mx-auto max-w-5xl py-10">
          <div className="rounded-2xl border border-neutral-300 p-6">
            <p className="text-sm font-semibold text-green-600">Status: Open</p>

            <h2 className="mt-2 text-3xl font-bold">{currentBattle.title}</h2>

            <p className="mt-2 text-neutral-500">
              {currentBattle.submissionCount} submission
              {currentBattle.submissionCount === 1 ? "" : "s"} so far.
            </p>

            <div className="mt-6">
              {currentBattle?.endsAt && (
                <CountdownTimer
                  targetDate={currentBattle.endsAt}
                  label="Submissions close in"
                />
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* ✅ Latest Winner Section */}
      <LatestWinner />

      <Core />
      <Join />
      <Testimonials />
      <Questions />
      <StayInTheFight />
      <GetInTouch />
    </main>
  );
}
