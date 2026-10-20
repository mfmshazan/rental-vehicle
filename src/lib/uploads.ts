import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

// Per-photo size cap. The Server Action body limit (next.config.ts) must stay
// at least MAX_PHOTOS * MAX_PHOTO_BYTES so a full gallery upload can arrive.
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

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
  const filename = `${randomUUID()}.${extension}`;
  const directory = path.join(
    process.cwd(),
    "data",
    "uploads",
    process.env.ROAM_TEST_MODE === "true" ? "test" : "live",
  );
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), buffer, { flag: "wx" });
  return `/api/photos/${filename}`;
}

// Store several uploaded photos, preserving their selected order.
export async function storePhotos(files: File[]) {
  const stored: string[] = [];
  for (const file of files) stored.push(await storePhoto(file));
  return stored;
}
