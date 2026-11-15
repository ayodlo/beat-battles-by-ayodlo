import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  newId,
  query,
  type Battle,
  type Submission,
  type Vote,
} from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { battleId, submissionId } = body;

    if (!battleId || !submissionId) {
      return NextResponse.json(
        { error: "battleId and submissionId are required" },
        { status: 400 },
      );
    }

    const [battle] = await query<Battle>(
      `SELECT * FROM "Battle" WHERE "id" = $1`,
      [battleId],
    );

    if (!battle) {
      return NextResponse.json({ error: "Battle not found" }, { status: 404 });
    }

    if (battle.status !== "open") {
      return NextResponse.json(
        { error: "This battle is closed" },
        { status: 403 },
      );
    }

    const [votedSubmission] = await query<Submission>(
      `SELECT * FROM "Submission" WHERE "id" = $1`,
      [submissionId],
    );

    if (!votedSubmission || votedSubmission.battleId !== battleId) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 },
      );
    }

    if (votedSubmission.userId === userId) {
      return NextResponse.json(
        { error: "You cannot vote for your own beat" },
        { status: 403 },
      );
    }

    const [vote] = await query<Vote>(
      `INSERT INTO "Vote" ("id", "userId", "battleId", "submissionId")
       VALUES ($1, $2, $3, $4)
       ON CONFLICT ("userId", "battleId")
       DO UPDATE SET "submissionId" = EXCLUDED."submissionId", "updatedAt" = NOW()
       RETURNING *`,
      [newId(), userId, battleId, submissionId],
    );

    return NextResponse.json({ vote }, { status: 200 });
  } catch (error) {
    console.error("Vote error:", error);

    return NextResponse.json(
      { error: "Something went wrong while voting" },
      { status: 500 },
    );
  }
}
