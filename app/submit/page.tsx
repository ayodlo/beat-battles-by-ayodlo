import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";
import ListenVote from "@/components/sections/submitbeat/ListenVote";
import ThisWeek from "@/components/sections/submitbeat/ThisWeek";
import Upload from "@/components/sections/submitbeat/Upload";
import { prisma } from "@/lib/prisma";

export default async function SubmitPage() {
  const battle = await prisma.battle.findFirst({
    where: {
      status: "open",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="px-6 py-8">
      <ThisWeek />

      {battle?.endsAt ? (
        <section>
          <CountdownTimer
            targetDate={battle.endsAt}
            label="Submissions close in"
          />
        </section>
      ) : null}

      <Upload />
      <ListenVote />
    </main>
  );
}
