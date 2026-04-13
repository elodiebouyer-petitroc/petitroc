import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const region = process.env.OVH_REGION || "eu-west-par";
const endpoint = (process.env.OVH_ENDPOINT || "https://s3.eu-west-par.io.cloud.ovh.net").replace(/\/$/, "");
const finalRegion = region === "par" ? "eu-west-par" : region;

console.log(`[OVH Storage] Initializing with region: ${finalRegion}, endpoint: ${endpoint}`);

const s3Client = new S3Client({
  region: finalRegion,
  endpoint: endpoint,
  credentials: {
    accessKeyId: process.env.OVH_ACCESS_KEY || "",
    secretAccessKey: process.env.OVH_SECRET_KEY || "",
  },
  forcePathStyle: true,
});

export async function generateSignedUrl(key: string, expiresIn: number = 86400) {
  const bucket = process.env.OVH_BUCKET_NAME || "ngt-formation";
  console.log(`[OVH Storage] Generating signed URL for Bucket: ${bucket}, Key: ${key}`);
  
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
}
