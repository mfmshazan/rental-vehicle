export const categories = [
  "All vehicles",
  "Hatchback",
  "Sedan",
  "SUV",
  "Luxury",
  "Van",
  "Sports",
] as const;
export const cities = [
  "Colombo",
  "Kandy",
  "Galle",
  "Negombo",
  "Ella",
  "Jaffna",
  "Matara",
  "Kurunegala",
  "Anuradhapura",
] as const;
export const features = [
  "Air conditioning",
  "Bluetooth",
  "Reverse camera",
  "USB charging",
  "Apple CarPlay",
  "Cruise control",
  "Child seat",
  "Airport pickup",
] as const;
export const money = (value: number) =>
  new Intl.NumberFormat("en-LK").format(value);

// The most photos a single listing may carry. Lives here (not in uploads.ts)
// so client components can import it without pulling in server-only modules.
export const MAX_PHOTOS = 6;

// Vehicle photos are stored as a JSON array in a TEXT column (same idiom as
// `features`). Parse safely and fall back to the legacy single `image`.
export function parsePhotos(
  photos: string | null | undefined,
  fallback?: string | null,
): string[] {
  let list: string[] = [];
  if (photos) {
    try {
      const parsed = JSON.parse(photos);
      if (Array.isArray(parsed))
        list = parsed.filter(
          (item): item is string => typeof item === "string" && item.length > 0,
        );
    } catch {
      // Ignore malformed data and use the fallback below.
    }
  }
  if (list.length === 0 && fallback) list = [fallback];
  return list;
}
export type VehicleCardData = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  city: string;
  dailyRate: number;
  transmission: string;
  fuel: string;
  seats: number;
  image: string;
  driveType: string;
  demo: boolean;
  owner: { name: string };
};

export function filterVehicles(
  vehicles: VehicleCardData[],
  filters: {
    query?: string;
    city?: string;
    category?: string;
    transmission?: string;
    maxPrice?: number;
    driveType?: string;
    sort?: string;
  },
) {
  const query = (filters.query || "").trim().toLowerCase();
  const filtered = vehicles.filter(
    (vehicle) =>
      (!query ||
        `${vehicle.title} ${vehicle.brand} ${vehicle.model} ${vehicle.city}`
          .toLowerCase()
          .includes(query)) &&
      (!filters.city || vehicle.city === filters.city) &&
      (!filters.category ||
        filters.category === "All vehicles" ||
        vehicle.category === filters.category) &&
      (!filters.transmission ||
        vehicle.transmission === filters.transmission) &&
      (!filters.driveType || vehicle.driveType === filters.driveType) &&
      (!filters.maxPrice || vehicle.dailyRate <= filters.maxPrice),
  );
  if (filters.sort === "price-asc")
    filtered.sort((a, b) => a.dailyRate - b.dailyRate);
  if (filters.sort === "price-desc")
    filtered.sort((a, b) => b.dailyRate - a.dailyRate);
  if (filters.sort === "year") filtered.sort((a, b) => b.year - a.year);
  return filtered;
}
