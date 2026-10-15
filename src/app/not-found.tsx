import Link from "next/link";
import { Icon } from "@/components/icon";
export default function NotFound() {
  return (
    <div className="container empty-state not-found">
      <span className="eyebrow">A SMALL DETOUR</span>
      <h1>This road ends here.</h1>
      <p>
        This page or vehicle is no longer available. There are more rides
        waiting to be discovered.
      </p>
      <Link href="/" className="button button-green">
        Back to Roam <Icon name="arrow" size={17} />
      </Link>
    </div>
  );
}
