import { prisma } from "./prisma";

function toStringArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export async function getVehicles() {
  const rows = await prisma.vehicle.findMany({
    where: { active: true },
    orderBy: [{ demo: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      brand: true,
      model: true,
      year: true,
      category: true,
      city: true,
      dailyRate: true,
      transmission: true,
      fuel: true,
      seats: true,
      image: true,
      driveType: true,
      purposes: true,
      demo: true,
      owner: { select: { name: true } },
    },
  });
  return rows.map((row) => ({ ...row, purposes: toStringArray(row.purposes) }));
}
