import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const battleId = searchParams.get("battleId");

  if (!battleId) {
    return NextResponse.json(
      { error: "battleId is required" },
      { status: 400 },
    );
  }

  return prisma.submission
    .findMany({
      where: { battleId },
      orderBy: { createdAt: "desc" },
    })
    .then((submissions) => {
      return NextResponse.json({ submissions });
    });
}
