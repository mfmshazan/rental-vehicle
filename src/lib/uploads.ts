import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";

// Per-photo size cap. The Server Action body limit (next.config.ts) must stay
// at least MAX_PHOTOS * MAX_PHOTO_BYTES so a full gallery upload can arrive.
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function storePhoto(file: File) {
  if (file.size > MAX_PHOTO_BYTES)
    throw new Error("Your photo must be smaller than 5 MB.");
  const buffer = Buffer.from(await file.arrayBuffer());
  let extension: string;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff)
    extension = "jpg";
  else if (
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    extension = "png";
  else if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  )
    extension = "webp";
  else throw new Error("Please upload a JPEG, PNG, or WebP photo.");
  // Namespace test uploads so they can be told apart from live listings.
  const prefix = process.env.ROAM_TEST_MODE === "true" ? "test" : "live";
  const { url } = await put(
    `uploads/${prefix}/${randomUUID()}.${extension}`,
    buffer,
    { access: "public", contentType: CONTENT_TYPES[extension] },
  );
  return url;
}

// Store several uploaded photos, preserving their selected order.
export async function storePhotos(files: File[]) {
  const stored: string[] = [];
  for (const file of files) stored.push(await storePhoto(file));
  return stored;
}
