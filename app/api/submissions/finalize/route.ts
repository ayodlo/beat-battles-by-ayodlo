import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  const existingSubmission = await prisma.submission.findUnique({
    where: {
      userId_battleId: {
        userId,
        battleId: body.battleId,
      },
    },
  });

  if (existingSubmission) {
    return NextResponse.json(
      { error: "You already submitted for this battle" },
      { status: 409 },
    );
  }

  const submission = await prisma.submission.create({
    data: {
      userId,
      username,
      battleId: body.battleId,
      fileKey: body.fileKey,
      fileUrl: body.fileUrl,
      fileName: body.fileName,
      fileSize: body.fileSize,
      mimeType: body.mimeType,
    },
  });

  return NextResponse.json({ submission });
}
