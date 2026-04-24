import { auth } from "@clerk/nextjs/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { s3, S3_BUCKET_NAME } from "@/lib/s3";

type RequestBody = {
  battleId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/wave"];

export function POST(req: Request) {
  return req.json().then(async (body: RequestBody) => {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { battleId, fileName, fileType, fileSize } = body;

    if (!battleId || !fileName || !fileType || !fileSize) {
      return NextResponse.json(
        { error: "Missing upload info" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "Only MP3 or WAV files allowed" },
        { status: 400 },
      );
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File must be under 10 MB" },
        { status: 400 },
      );
    }

    const existingSubmission = await prisma.submission.findUnique({
      where: {
        userId_battleId: {
          userId,
          battleId,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "You already submitted for this battle" },
        { status: 409 },
      );
    }

    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileKey = `submissions/${battleId}/${userId}/${Date.now()}-${safeFileName}`;

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: fileKey,
        ContentType: fileType,
      }),
      { expiresIn: 60 },
    );

    const fileUrl = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return NextResponse.json({
      uploadUrl,
      fileKey,
      fileUrl,
    });
  });
}
