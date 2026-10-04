import { NextResponse } from "next/server";
import { query, type Submission } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const battleId = searchParams.get("battleId");

  if (!battleId) {
    return NextResponse.json(
      { error: "battleId is required" },
      { status: 400 },
    );
  }

  return query<Submission>(
    `SELECT * FROM "Submission" WHERE "battleId" = $1 ORDER BY "createdAt" DESC`,
    [battleId],
  ).then((submissions) => {
      return NextResponse.json({ submissions });
    });
}
