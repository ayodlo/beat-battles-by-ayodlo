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
    data: {
      hiddenFromHistory: true,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/past-battles");
  revalidatePath("/");
}

async function selectWinner(battleId: string, submissionId: string) {
  "use server";

  await prisma.submission.updateMany({
    where: {
      battleId,
    },
    data: {
      placement: null,
    },
  });

  await prisma.submission.update({
    where: {
      id: submissionId,
    },
    data: {
      placement: 1,
    },
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
    orderBy: {
      createdAt: "desc",
    },
    include: {
      submissions: {
        include: {
          votes: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      votes: true,
    },
  });

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold">Battle Dashboard</h1>

      <section className="mt-10 rounded-2xl border border-neutral-300 p-6">
        <h2 className="text-2xl font-bold">Create Battle</h2>

        <form action={createBattle} className="mt-6 grid gap-4">
          <input
            name="title"
            placeholder="Weekly Beat Battle #1"
            className="w-full rounded-xl border px-4 py-3"
            required
          />

          <input
            name="slug"
            placeholder="weekly-battle-001"
            className="w-full rounded-xl border px-4 py-3"
            required
          />

          <button className="rounded-xl bg-black px-5 py-3 text-white">
            Create Battle
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Existing Battles</h2>

        <div className="mt-6 grid gap-4">
          {battles.map((battle) => {
            const selectedWinner = battle.submissions.find(
              (submission) => submission.placement === 1,
            );

            return (
              <article
                key={battle.id}
                className="rounded-2xl border border-neutral-300 p-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{battle.title}</h3>

                  <p className="text-sm text-neutral-500">
                    /past-battles/{battle.slug}
                  </p>

                  <p className="text-sm text-neutral-500">
                    Starts:{" "}
                    {battle.startsAt ? battle.startsAt.toLocaleString() : "N/A"}
                  </p>

                  <p className="text-sm text-neutral-500">
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

                  {battle.hiddenFromHistory ? (
                    <p className="text-sm font-semibold text-orange-600">
                      Hidden from history
                    </p>
                  ) : null}

                  {selectedWinner ? (
                    <p className="text-sm font-semibold text-yellow-600">
                      Winner selected:{" "}
                      {selectedWinner.username ||
                        selectedWinner.username ||
                        "Unknown producer"}
                    </p>
                  ) : null}

                  <p className="text-sm text-neutral-500">
                    {battle.submissions.length} submission
                    {battle.submissions.length === 1 ? "" : "s"}
                  </p>

                  <p className="text-sm text-neutral-500">
                    {battle.votes.length} vote
                    {battle.votes.length === 1 ? "" : "s"}
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
                        <button className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
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
                        <button className="rounded-lg border border-green-500 px-4 py-2 text-sm text-green-600 hover:bg-green-50">
                          Open Battle
                        </button>
                      </form>
                    )}

                    {!battle.hiddenFromHistory ? (
                      <form
                        action={hideBattleFromHistory.bind(null, battle.id)}
                      >
                        <button className="rounded-lg border border-neutral-500 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                          Hide from History
                        </button>
                      </form>
                    ) : null}
                  </div>

                  {battle.submissions.length > 0 ? (
                    <div className="mt-6 border-t border-neutral-200 pt-5">
                      <h4 className="font-bold">Submissions</h4>

                      <div className="mt-4 grid gap-3">
                        {battle.submissions.map((submission) => {
                          const isWinner = submission.placement === 1;

                          return (
                            <div
                              key={submission.id}
                              className="rounded-xl border border-neutral-200 p-4"
                            >
                              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                  <p className="font-semibold">
                                    {submission.username ||
                                      submission.username ||
                                      "Unknown producer"}
                                  </p>

                                  <p className="text-sm text-neutral-500">
                                    {submission.fileName}
                                  </p>

                                  <p className="text-sm text-neutral-500">
                                    {submission.votes.length} vote
                                    {submission.votes.length === 1 ? "" : "s"}
                                  </p>

                                  {isWinner ? (
                                    <p className="mt-2 inline-block rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                                      Winner
                                    </p>
                                  ) : null}
                                </div>

                                {!isWinner ? (
                                  <form
                                    action={selectWinner.bind(
                                      null,
                                      battle.id,
                                      submission.id,
                                    )}
                                  >
                                    <button className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800">
                                      Select Winner
                                    </button>
                                  </form>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
