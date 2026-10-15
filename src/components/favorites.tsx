"use client";
import { useSyncExternalStore } from "react";
import { Icon } from "./icon";

const key = "roam-saved-vehicles";
const empty: string[] = [];
let cachedRaw: string | null = null;
let cachedIds: string[] = empty;
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("roam-saved", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("roam-saved", callback);
  };
}
function snapshot() {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      const parsed = JSON.parse(raw || "[]");
      cachedIds = Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === "string")
        : empty;
    }
  } catch {
    cachedIds = empty;
  }
  return cachedIds;
}
export function useFavorites() {
  return useSyncExternalStore(subscribe, snapshot, () => empty);
}
export function FavoriteButton({
  id,
  large = false,
}: {
  id: string;
  large?: boolean;
}) {
  const favorites = useFavorites();
  const saved = favorites.includes(id);
  function toggle() {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(
          saved ? favorites.filter((item) => item !== id) : [...favorites, id],
        ),
      );
      window.dispatchEvent(new Event("roam-saved"));
    } catch {
      alert(
        "Your browser is blocking saved vehicles. Enable local storage to save this vehicle.",
      );
    }
  }
  return (
    <button
      type="button"
      className={`${large ? "button button-outline" : "favorite-button"} ${saved ? "is-saved" : ""}`}
      onClick={toggle}
      aria-label={saved ? "Remove from saved vehicles" : "Save vehicle"}
      aria-pressed={saved}
    >
      <Icon name="heart" size={19} />
      {large && (saved ? "Saved" : "Save vehicle")}
    </button>
  );
}
