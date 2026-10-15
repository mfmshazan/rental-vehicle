import type { Metadata } from "next";
import { Marketplace } from "@/components/marketplace";
import { getVehicles } from "@/lib/queries";
export const metadata: Metadata = { title: "Saved vehicles" };
export const dynamic = "force-dynamic";
export default async function SavedPage() {
  return <Marketplace vehicles={await getVehicles()} savedOnly />;
}
