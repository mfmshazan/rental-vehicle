import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getVehicles } from "@/lib/queries";
import { parsePhotos } from "@/lib/marketplace";
import { Icon } from "@/components/icon";
import { FavoriteButton } from "@/components/favorites";
import { ContactPanel } from "@/components/contact-panel";
import { PhotoGallery } from "@/components/photo-gallery";
import { VehicleCard } from "@/components/vehicle-card";

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findFirst({
    where: { id, active: true },
    select: { title: true, city: true },
  });
  return {
    title: vehicle
      ? `${vehicle.title} in ${vehicle.city}`
      : "Vehicle not found",
  };
}
export default async function VehiclePage({ params }: Props) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findFirst({
    where: { id, active: true },
    include: { owner: { select: { name: true, phone: true } } },
  });
  if (!vehicle) notFound();
  const related = (await getVehicles())
    .filter((item) => item.id !== id)
    .slice(0, 3);
  const features: string[] = JSON.parse(vehicle.features);
  const photos = parsePhotos(vehicle.photos, vehicle.image);
  return (
    <div className="container detail-page">
      <Link href="/#explore" className="back-link">
        ← Back to vehicles
      </Link>
      <div className="detail-heading">
        <div>
          <div className="eyebrow">
            {vehicle.category.toUpperCase()} · {vehicle.driveType.toUpperCase()}
          </div>
          <h1>{vehicle.title}</h1>
          <p>
            <Icon name="pin" size={16} />
            {vehicle.city}, Sri Lanka <span>·</span>
            {vehicle.year}
            {vehicle.demo && <span className="pill">Demo listing</span>}
          </p>
        </div>
        <FavoriteButton id={id} large />
      </div>
      <div className="detail-layout">
        <div className="detail-main">
          <PhotoGallery
            photos={photos}
            alt={vehicle.title}
            tag={vehicle.demo ? "Illustrative photo" : vehicle.driveType}
          />
          <div className="detail-specs">
            {[
              ["gear", vehicle.transmission, "Transmission"],
              ["users", `${vehicle.seats} seats`, "Room for everyone"],
              ["fuel", vehicle.fuel, "Fuel type"],
              ["key", vehicle.driveType, "Rental type"],
            ].map(([icon, value, label]) => (
              <div key={label}>
                <Icon name={icon} size={25} />
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <section className="detail-copy">
            <h2>Meet your next ride.</h2>
            <p>{vehicle.description}</p>
          </section>
          {features.length > 0 && (
            <section className="detail-copy">
              <h2>The little extras.</h2>
              <div className="feature-list">
                {features.map((feature) => (
                  <span key={feature}>
                    <Icon name="check" size={18} />
                    {feature}
                  </span>
                ))}
              </div>
            </section>
          )}
          <section className="detail-copy rental-note">
            <h3>Good to know before you go</h3>
            <p>
              Rental dates and availability are confirmed directly with the
              owner. Ask about pickup arrangements, included kilometres, fuel
              policy, deposits, and insurance. The daily rate is a starting
              point; agree the full cost before your trip.
            </p>
          </section>
        </div>
        <ContactPanel
          id={id}
          title={vehicle.title}
          dailyRate={vehicle.dailyRate}
          ownerName={vehicle.owner.name}
          phone={vehicle.owner.phone}
          demo={vehicle.demo}
        />
      </div>
      <section className="related-section">
        <div className="section-top">
          <div>
            <div className="eyebrow">KEEP EXPLORING</div>
            <h2>More roads. More possibilities.</h2>
          </div>
          <Link className="text-link" href="/#explore">
            All vehicles <Icon name="arrow" size={17} />
          </Link>
        </div>
        <div className="vehicle-grid">
          {related.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>
    </div>
  );
}
