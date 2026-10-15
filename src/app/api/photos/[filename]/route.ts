import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(filename))
    return new Response("Not found", { status: 404 });
  try {
    const photo = await readFile(
      path.join(
        process.cwd(),
        "data",
        "uploads",
        process.env.ROAM_TEST_MODE === "true" ? "test" : "live",
        filename,
      ),
    );
    const extension = filename.split(".").pop();
    return new Response(photo, {
      headers: {
        "Content-Type":
          extension === "jpg" ? "image/jpeg" : `image/${extension}`,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
