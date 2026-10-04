import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { query, type Submission } from "@/lib/db";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const battleId = searchParams.get("battleId");
  if (!battleId) {
    return NextResponse.json(
      { error: "battleId is required" },
      { status: 400 },
    );
  }
  const [submission] = await query<Submission>(
    `SELECT * FROM "Submission" WHERE "userId" = $1 AND "battleId" = $2`,
    [userId, battleId],
  );
  return NextResponse.json({
    hasSubmitted: Boolean(submission),
    submission: submission ?? null,
  });
}
