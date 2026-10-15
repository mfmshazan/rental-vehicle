import { Marketplace } from "@/components/marketplace";
import { getVehicles } from "@/lib/queries";

export const dynamic = "force-dynamic";
export default async function Home() {
  return <Marketplace vehicles={await getVehicles()} />;
}
