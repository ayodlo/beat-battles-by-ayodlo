import { NextResponse } from "next/server";
import { HeadBucketCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET_NAME } from "@/lib/s3";

export function GET() {
  return s3
    .send(
      new HeadBucketCommand({
        Bucket: S3_BUCKET_NAME,
      }),
    )
    .then(() => {
      return NextResponse.json({
        success: true,
        message: "S3 connection successful",
        bucket: S3_BUCKET_NAME,
      });
    })
    .catch((error: unknown) => {
      console.error("S3 test failed:", error);

      return NextResponse.json(
        {
          success: false,
          message: "S3 connection failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    });
}
