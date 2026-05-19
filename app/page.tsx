import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";
import Core from "@/components/_sections/home/Core";
import Intro from "@/components/_sections/home/Intro";
import Join from "@/components/_sections/home/Join";
import Testimonials from "@/components/_sections/home/Testimonials";
import StayInTheFight from "@/components/_sections/home/GetNotified";
import GetInTouch from "@/components/_sections/home/GetInTouch";
import Questions from "@/components/_sections/home/Questions";
import LatestWinner from "@/components/_sections/home/LatestWinner";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const currentBattle = await prisma.battle.findFirst({
    where: {
      status: "open",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      submissions: true,
    },
  });

  return (
    <main className="px-6 py-8">
      <Intro />

      {currentBattle ? (
        <section className="mx-auto max-w-5xl py-10">
          <div className="rounded-2xl border border-neutral-300 p-6">
            <p className="text-sm font-semibold text-green-600">Status: Open</p>

            <h2 className="mt-2 text-3xl font-bold">{currentBattle.title}</h2>

            <p className="mt-2 text-neutral-500">
              {currentBattle.submissions.length} submission
              {currentBattle.submissions.length === 1 ? "" : "s"} so far.
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
