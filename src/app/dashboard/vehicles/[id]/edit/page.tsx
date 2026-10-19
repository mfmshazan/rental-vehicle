import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { VehicleForm } from "@/components/vehicle-form";
import { AvailabilityManager } from "@/components/availability-manager";
export const metadata = { title: "Edit vehicle" };
export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;
  const vehicle = await prisma.vehicle.findFirst({
    where: { id, ownerId: session.user.id, demo: false },
    include: { blockedPeriods: { orderBy: { startDate: "asc" } } },
  });
  if (!vehicle) notFound();
  return (
    <div className="container edit-page">
      <Link href="/dashboard" className="back-link">
        ← Back to dashboard
      </Link>
      <div className="page-heading">
        <div className="eyebrow">KEEP IT FRESH</div>
        <h1>Edit your vehicle.</h1>
        <p>Make sure renters have the latest details.</p>
      </div>
      <VehicleForm vehicle={vehicle} />
      <AvailabilityManager
        vehicleId={vehicle.id}
        periods={vehicle.blockedPeriods.map((period) => ({
          id: period.id,
          startDate: period.startDate,
          endDate: period.endDate,
        }))}
      />
    </div>
  );
}
