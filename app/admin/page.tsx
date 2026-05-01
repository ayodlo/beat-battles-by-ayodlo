import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type BattleStatus = "open" | "closed";

async function createBattle(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();

  if (!title || !slug) {
    throw new Error("Title and slug are required.");
  }

  const startsAt = new Date();
  const endsAt = new Date();
  endsAt.setDate(endsAt.getDate() + 14);

  await prisma.battle.create({
    data: {
      title,
      slug,
      status: "open",
      startsAt,
      endsAt,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/submit");
  revalidatePath("/past-battles");
  revalidatePath("/");
}

async function updateBattleStatus(id: string, status: BattleStatus) {
  "use server";

  await prisma.battle.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin");
  revalidatePath("/submit");
  revalidatePath("/past-battles");
  revalidatePath("/");
}

async function hideBattleFromHistory(id: string) {
  "use server";

  await prisma.battle.update({
    where: { id },
    data: { hiddenFromHistory: true },
  });

  revalidatePath("/admin");
  revalidatePath("/past-battles");
  revalidatePath("/");
}

async function selectWinner(battleId: string, submissionId: string) {
  "use server";

  await prisma.submission.updateMany({
    where: { battleId },
    data: { placement: null },
  });

  await prisma.submission.update({
    where: { id: submissionId },
    data: { placement: 1 },
  });

  revalidatePath("/admin");
  revalidatePath("/past-battles");
  revalidatePath("/");
}

export default async function AdminPage() {
  const { userId } = await auth();

  const adminUserIds = process.env.ADMIN_USER_IDS?.split(",") ?? [];

  if (!userId || !adminUserIds.includes(userId)) {
    redirect("/");
  }

  const battles = await prisma.battle.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      submissions: {
        include: { votes: true },
        orderBy: { createdAt: "asc" },
      },
      votes: true,
    },
  });

  return (
    <main className="bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-5xl space-y-12">
        <h1 className="text-4xl font-bold">Battle Dashboard</h1>

        {/* Create Battle */}
        <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground">
          <h2 className="text-2xl font-bold">Create Battle</h2>

          <form action={createBattle} className="mt-6 grid gap-4">
            <input
              name="title"
              placeholder="Weekly Beat Battle #1"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              required
            />

            <input
              name="slug"
              placeholder="weekly-battle-001"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              required
            />

            <button className="w-fit rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background">
              Create Battle
            </button>
          </form>
        </section>

        {/* Existing Battles */}
        <section>
          <h2 className="text-2xl font-bold">Existing Battles</h2>

          <div className="mt-6 grid gap-4">
            {battles.map((battle) => {
              const selectedWinner = battle.submissions.find(
                (s) => s.placement === 1,
              );

              return (
                <article
                  key={battle.id}
                  className="rounded-2xl border border-border bg-card p-6 text-card-foreground"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{battle.title}</h3>

                    <p className="text-sm text-muted-foreground">
                      /past-battles/{battle.slug}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Starts:{" "}
                      {battle.startsAt
                        ? battle.startsAt.toLocaleString()
                        : "N/A"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Ends:{" "}
                      {battle.endsAt ? battle.endsAt.toLocaleString() : "N/A"}
                    </p>

                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          battle.status === "open"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {battle.status === "open" ? "Open" : "Closed"}
                      </span>
                    </p>

                    {battle.hiddenFromHistory && (
                      <p className="text-sm font-semibold text-orange-600">
                        Hidden from history
                      </p>
                    )}

                    {selectedWinner && (
                      <p className="text-sm font-semibold text-yellow-600">
                        Winner selected:{" "}
                        {selectedWinner.username || "Unknown producer"}
                      </p>
                    )}

                    <p className="text-sm text-muted-foreground">
                      {battle.submissions.length} submissions
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {battle.votes.length} votes
                    </p>

                    <div className="flex flex-wrap gap-3 pt-3">
                      {battle.status === "open" ? (
                        <form
                          action={updateBattleStatus.bind(
                            null,
                            battle.id,
                            "closed",
                          )}
                        >
                          <button className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-600">
                            Close Battle
                          </button>
                        </form>
                      ) : (
                        <form
                          action={updateBattleStatus.bind(
                            null,
                            battle.id,
                            "open",
                          )}
                        >
                          <button className="rounded-lg border border-green-500 px-4 py-2 text-sm text-green-600">
                            Open Battle
                          </button>
                        </form>
                      )}

                      {!battle.hiddenFromHistory && (
                        <form
                          action={hideBattleFromHistory.bind(null, battle.id)}
                        >
                          <button className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground">
                            Hide from History
                          </button>
                        </form>
                      )}
                    </div>

                    {battle.submissions.length > 0 && (
                      <div className="mt-6 border-t border-border pt-5">
                        <h4 className="font-bold">Submissions</h4>

                        <div className="mt-4 grid gap-3">
                          {battle.submissions.map((submission) => {
                            const isWinner = submission.placement === 1;

                            return (
                              <div
                                key={submission.id}
                                className="rounded-xl border border-border p-4"
                              >
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <p className="font-semibold">
                                      {submission.username ||
                                        "Unknown producer"}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                      {submission.fileName}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                      {submission.votes.length} votes
                                    </p>

                                    {isWinner && (
                                      <p className="mt-2 inline-block rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                                        Winner
                                      </p>
                                    )}
                                  </div>

                                  {!isWinner && (
                                    <form
                                      action={selectWinner.bind(
                                        null,
                                        battle.id,
                                        submission.id,
                                      )}
                                    >
                                      <button className="rounded-lg bg-foreground px-4 py-2 text-sm text-background">
                                        Select Winner
                                      </button>
                                    </form>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
