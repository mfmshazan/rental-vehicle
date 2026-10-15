import { prisma } from "./prisma";

export async function getVehicles() {
  return prisma.vehicle.findMany({
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
      demo: true,
      owner: { select: { name: true } },
    },
  });
}
