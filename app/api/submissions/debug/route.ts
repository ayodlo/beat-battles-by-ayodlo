import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export function GET() {
  return prisma.submission.findMany().then((submissions) => {
    return NextResponse.json({ submissions });
  });
}
