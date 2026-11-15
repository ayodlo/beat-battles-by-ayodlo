import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { newId, query, type Submission } from "@/lib/db";

type RequestBody = {
  battleId: string;
  fileKey: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as RequestBody;

  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const username =
    user.username ||
    user.firstName ||
    user.emailAddresses[0]?.emailAddress ||
    "anonymous";

  const [existingSubmission] = await query<Submission>(
    `SELECT * FROM "Submission" WHERE "userId" = $1 AND "battleId" = $2`,
    [userId, body.battleId],
  );

  if (existingSubmission) {
    return NextResponse.json(
      { error: "You already submitted for this battle" },
      { status: 409 },
    );
  }

  const [submission] = await query<Submission>(
    `INSERT INTO "Submission"
       ("id", "userId", "username", "battleId", "fileKey", "fileUrl", "fileName", "fileSize", "mimeType")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      newId(),
      userId,
      username,
      body.battleId,
      body.fileKey,
      body.fileUrl,
      body.fileName,
      body.fileSize,
      body.mimeType,
    ],
  );

  return NextResponse.json({ submission });
}
