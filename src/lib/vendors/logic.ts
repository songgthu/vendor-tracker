import { STUCK_THRESHOLD_DAYS, STAGES, stageIndex } from "./stages";
import type { Stage, Vendor } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

export function filterAndSortVendors(vendors: Vendor[], query: string, sort: "name" | "stage") {
  const normalizedQuery = query.trim().toLowerCase();
  return vendors
    .filter((vendor) => vendor.vendor.toLowerCase().includes(normalizedQuery))
    .sort((left, right) =>
      sort === "stage"
        ? stageIndex(left.stage) - stageIndex(right.stage)
        : left.vendor.localeCompare(right.vendor)
    );
}

export function daysInStage(vendor: Vendor, now = Date.now()) {
  return Math.floor((now - new Date(vendor.stageEnteredAt).getTime()) / DAY_MS);
}

export function isVendorStuck(vendor: Vendor, now = Date.now()) {
  const elapsed = now - new Date(vendor.stageEnteredAt).getTime();
  return elapsed > STUCK_THRESHOLD_DAYS * DAY_MS;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export { STAGES };
export type { Stage };
