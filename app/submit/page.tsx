import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";
import ListenVote from "@/components/_sections/submitbeat/ListenVote";
import ThisWeek from "@/components/_sections/submitbeat/ThisWeek";
import Upload from "@/components/_sections/submitbeat/Upload";
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
    <main className="bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-5xl space-y-20">
        <ThisWeek />

        {battle?.endsAt ? (
          <CountdownTimer
            targetDate={battle.endsAt}
            label="Submissions close in"
          />
        ) : null}

        <Upload />
        <ListenVote />
      </div>
    </main>
  );
}
