import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export function GET() {
  return prisma.battle
    .findFirst({
      where: {
        status: "open",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        endsAt: true,
      },
    })
    .then((battle) => {
      if (!battle) {
        return NextResponse.json({ battle: null }, { status: 200 });
      }

      return NextResponse.json({ battle }, { status: 200 });
    })
    .catch((error: Error) => {
      console.error("CURRENT BATTLE ERROR:", error);

      return NextResponse.json(
        { error: "Could not fetch current battle" },
        { status: 500 },
      );
    });
}
