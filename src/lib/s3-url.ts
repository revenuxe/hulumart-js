import { getS3Config } from "./s3";

/** Builds the public URL for an object key. Uses AWS_S3_PUBLIC_URL (a
 * CloudFront/custom-domain front for the bucket) when set, otherwise falls
 * back to the default S3 virtual-hosted-style URL — see next.config.ts's
 * remotePatterns, which allowlists both shapes for next/image. */
export function s3PublicUrl(key: string): string {
  const { region, bucketName } = getS3Config();
  const base = process.env.AWS_S3_PUBLIC_URL?.replace(/\/+$/, "");
  if (base) return `${base}/${key}`;
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}

/** Reverses s3PublicUrl — extracts the object key back out of either URL
 * shape, so deletes work regardless of which one produced the stored URL. */
export function s3KeyFromUrl(url: string): string | null {
  const { region, bucketName } = getS3Config();
  const base = process.env.AWS_S3_PUBLIC_URL?.replace(/\/+$/, "");
  if (base && url.startsWith(base + "/")) return decodeURIComponent(url.slice(base.length + 1));

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== `${bucketName}.s3.${region}.amazonaws.com`) return null;
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, "")) || null;
  } catch {
    return null;
  }
}
