import { NextResponse } from "next/server";
import { query, type Battle } from "@/lib/db";

export function GET() {
  return query<Pick<Battle, "id" | "title" | "slug" | "status" | "endsAt">>(
    `SELECT "id", "title", "slug", "status", "endsAt" FROM "Battle"
     WHERE "status" = 'open'
     ORDER BY "createdAt" DESC
     LIMIT 1`,
  )
    .then(([battle]) => {
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
