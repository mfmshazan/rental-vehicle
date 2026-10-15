import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/marketplace";
import {
  logoutAction,
  toggleVehicleAction,
  markInquiryReadAction,
} from "@/app/actions";
import { Icon } from "@/components/icon";
export const metadata = { title: "Owner dashboard" };
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const [vehicles, inquiries, params] = await Promise.all([
    prisma.vehicle.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.inquiry.findMany({
      where: { vehicle: { ownerId: session.user.id } },
      include: { vehicle: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    }),
    searchParams,
  ]);
  return (
    <div className="container dashboard-page">
      <div className="dashboard-heading">
        <div className="page-heading">
          <div className="eyebrow">YOUR OWNER SPACE</div>
          <h1>Hello, {session.user.name?.split(" ")[0] || "there"}.</h1>
          <p>Good journeys start with you. Here’s what’s happening.</p>
        </div>
        <form action={logoutAction}>
          <button className="button button-outline">Log out</button>
        </form>
      </div>
      {params.published && (
        <p className="form-message success" role="status">
          Your vehicle has been saved. You can manage it below.
        </p>
      )}
      <div className="dashboard-stats">
        <div>
          <Icon name="car" size={23} />
          <strong>{vehicles.length}</strong>
          <span>Total vehicles</span>
        </div>
        <div>
          <Icon name="check" size={23} />
          <strong>{vehicles.filter((vehicle) => vehicle.active).length}</strong>
          <span>Published listings</span>
        </div>
        <div>
          <Icon name="chat" size={23} />
          <strong>{inquiries.filter((inquiry) => !inquiry.read).length}</strong>
          <span>New inquiries</span>
        </div>
      </div>
      <section className="dashboard-section">
        <div className="section-top">
          <h2>Your vehicles</h2>
          <Link href="/list-your-car" className="button button-green">
            <Icon name="plus" size={17} /> Add a vehicle
          </Link>
        </div>
        {vehicles.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">
              <Icon name="car" size={32} />
            </span>
            <h3>Your driveway has potential.</h3>
            <p>
              Publish your first vehicle and help someone find their next ride.
            </p>
            <Link href="/list-your-car" className="button button-green">
              List your first vehicle <Icon name="arrow" size={17} />
            </Link>
          </div>
        ) : (
          <div className="dashboard-vehicles">
            {vehicles.map((vehicle) => (
              <article className="dashboard-vehicle" key={vehicle.id}>
                <div className="dashboard-vehicle-photo">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.title}
                    fill
                    unoptimized={vehicle.image.startsWith("/api/")}
                    sizes="160px"
                  />
                </div>
                <div className="dashboard-vehicle-info">
                  <span
                    className={`status-pill ${vehicle.active ? "published" : "paused"}`}
                  >
                    {vehicle.active ? "Published" : "Paused"}
                  </span>
                  <h3>{vehicle.title}</h3>
                  <p>
                    {vehicle.city} · Rs. {money(vehicle.dailyRate)} / day
                  </p>
                </div>
                <div className="dashboard-vehicle-actions">
                  {vehicle.active && (
                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="text-link"
                    >
                      View <Icon name="northeast" size={14} />
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/vehicles/${vehicle.id}/edit`}
                    className="button button-outline"
                  >
                    Edit
                  </Link>
                  <form action={toggleVehicleAction}>
                    <input type="hidden" name="id" value={vehicle.id} />
                    <button className="button button-outline">
                      {vehicle.active ? "Pause" : "Publish"}
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="dashboard-section" id="inquiries">
        <div className="section-top">
          <div>
            <h2>Your inquiries</h2>
            <p>Reply directly using the customer’s contact details.</p>
          </div>
          <span className="pill">{inquiries.length} received</span>
        </div>
        {inquiries.length === 0 ? (
          <div className="inbox-empty">
            <Icon name="mail" size={28} />
            <h3>A fresh inbox, ready for possibilities.</h3>
            <p>
              Customer inquiries will appear here when they get in touch through
              your listings.
            </p>
          </div>
        ) : (
          <div className="inquiry-list">
            {inquiries.map((inquiry) => (
              <article
                key={inquiry.id}
                className={`inquiry-card ${!inquiry.read ? "unread" : ""}`}
              >
                <div className="inquiry-card-top">
                  <span className="eyebrow">{inquiry.vehicle.title}</span>
                  <span>
                    {new Intl.DateTimeFormat("en-LK", {
                      dateStyle: "medium",
                      timeZone: "Asia/Colombo",
                    }).format(inquiry.createdAt)}
                  </span>
                </div>
                <h3>
                  {inquiry.name}
                  {!inquiry.read && (
                    <span className="status-pill published">New</span>
                  )}
                </h3>
                <div className="inquiry-dates">
                  {inquiry.startDate} → {inquiry.endDate}
                </div>
                <p className="inquiry-message">{inquiry.message}</p>
                <div className="inquiry-actions">
                  <a href={`mailto:${inquiry.email}`} className="text-link">
                    <Icon name="mail" size={16} />
                    {inquiry.email}
                  </a>
                  <a href={`tel:${inquiry.phone}`} className="text-link">
                    <Icon name="phone" size={16} />
                    {inquiry.phone}
                  </a>
                  {!inquiry.read && (
                    <form action={markInquiryReadAction}>
                      <input type="hidden" name="id" value={inquiry.id} />
                      <button className="button button-outline">
                        Mark as read
                      </button>
                    </form>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
