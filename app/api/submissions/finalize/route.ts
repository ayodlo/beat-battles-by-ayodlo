import { auth } from "@clerk/nextjs/server";
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

export function POST(req: Request) {
  return req.json().then(async (body: RequestBody) => {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        battleId: body.battleId,
        fileKey: body.fileKey,
        fileUrl: body.fileUrl,
        fileName: body.fileName,
        fileSize: body.fileSize,
        mimeType: body.mimeType,
      },
    });

    return NextResponse.json({ submission });
  });
}
