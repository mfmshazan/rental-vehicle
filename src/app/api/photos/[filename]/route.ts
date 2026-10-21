import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(filename))
    return new Response("Not found", { status: 404 });

  // Only serve photos that belong to an active listing. A paused listing's
  // photos stay visible to its owner (so the edit page still shows them).
  const url = `/api/photos/${filename}`;
  const vehicle = await prisma.vehicle.findFirst({
    where: { OR: [{ image: url }, { photos: { contains: url } }] },
    select: { active: true, ownerId: true },
  });
  if (!vehicle) return new Response("Not found", { status: 404 });
  if (!vehicle.active) {
    const session = await auth();
    if (session?.user?.id !== vehicle.ownerId)
      return new Response("Not found", { status: 404 });
  }

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
