import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  const submission = await prisma.submission.findUnique({
    where: {
      userId_battleId: {
        userId,
        battleId,
      },
    },
  });
  return NextResponse.json({
    hasSubmitted: Boolean(submission),
    submission,
  });
}
