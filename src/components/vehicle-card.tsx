import Image from "next/image";
import Link from "next/link";
import type { VehicleCardData } from "@/lib/marketplace";
import { money } from "@/lib/marketplace";
import { Icon } from "./icon";
import { FavoriteButton } from "./favorites";

export function VehicleCard({ vehicle }: { vehicle: VehicleCardData }) {
  return (
    <article className="vehicle-card">
      <div className="card-photo">
        <Link
          href={`/vehicles/${vehicle.id}`}
          aria-label={`View ${vehicle.title}`}
        >
          <Image
            src={vehicle.image}
            alt={vehicle.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
            unoptimized={vehicle.image.startsWith("/api/")}
          />
        </Link>
        <span className="photo-tag">{vehicle.driveType}</span>
        <FavoriteButton id={vehicle.id} />
      </div>
      <div className="card-content">
        <div className="card-location">
          <span>
            <Icon name="pin" size={13} />
            {vehicle.city}
          </span>
          <span>{vehicle.year}</span>
        </div>
        <Link className="card-title" href={`/vehicles/${vehicle.id}`}>
          {vehicle.title}
        </Link>
        <div className="vehicle-specs">
          <span>
            <Icon name="gear" size={15} />
            {vehicle.transmission}
          </span>
          <span>
            <Icon name="users" size={15} />
            {vehicle.seats} seats
          </span>
          <span>
            <Icon name="fuel" size={15} />
            {vehicle.fuel}
          </span>
        </div>
        <div className="card-bottom">
          <div>
            <strong>Rs. {money(vehicle.dailyRate)}</strong>
            <span> / day</span>
          </div>
          <Link
            href={`/vehicles/${vehicle.id}`}
            className="card-arrow"
            aria-label={`View ${vehicle.title} details`}
          >
            <Icon name="northeast" size={20} />
          </Link>
        </div>
        <div className="card-owner">
          <span className="avatar">{vehicle.owner.name[0]}</span>
          <span>{vehicle.owner.name}</span>
          <span className="card-owner-label">
            {vehicle.demo ? "Demo listing" : "Vehicle owner"}
          </span>
        </div>
      </div>
    </article>
  );
}
