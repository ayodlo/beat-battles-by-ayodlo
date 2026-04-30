import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const battle = await prisma.battle.findUnique({
      where: { id: battleId },
    });

    if (!battle) {
      return NextResponse.json({ error: "Battle not found" }, { status: 404 });
    }

    if (battle.status !== "open") {
      return NextResponse.json(
        { error: "This battle is closed" },
        { status: 403 },
      );
    }

    const votedSubmission = await prisma.submission.findUnique({
      where: {
        id: submissionId,
      },
    });

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

    const vote = await prisma.vote.upsert({
      where: {
        userId_battleId: {
          userId,
          battleId,
        },
      },
      update: {
        submissionId,
      },
      create: {
        userId,
        battleId,
        submissionId,
      },
    });

    return NextResponse.json({ vote }, { status: 200 });
  } catch (error) {
    console.error("Vote error:", error);

    return NextResponse.json(
      { error: "Something went wrong while voting" },
      { status: 500 },
    );
  }
}
