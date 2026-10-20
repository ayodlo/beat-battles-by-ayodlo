import { auth } from "@clerk/nextjs/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { s3, S3_BUCKET_NAME } from "@/lib/s3";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const fileKey = searchParams.get("fileKey");
  if (!fileKey) {
    return NextResponse.json({ error: "fileKey is required" }, { status: 400 });
  }
  const playbackUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
    }),
    { expiresIn: 300 },
  );
  return NextResponse.json({ playbackUrl });
}
