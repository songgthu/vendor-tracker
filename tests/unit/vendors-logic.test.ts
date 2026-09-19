import { describe, expect, it } from "vitest";

import { filterAndSortVendors, isVendorStuck } from "@/lib/vendors/logic";
import type { Vendor } from "@/lib/vendors/types";

const vendors: Vendor[] = [
  { id: 1, vendor: "Zulu", region: "HCMC", stage: "Active", stageEnteredAt: "2026-09-01T00:00:00.000Z", coordinator: "A", lastUpdated: "2026-09-01T00:00:00.000Z", updatedBy: "A", notes: "" },
  { id: 2, vendor: "Alpha", region: "Hanoi", stage: "Contract Sent", stageEnteredAt: "2026-09-18T00:00:00.000Z", coordinator: "B", lastUpdated: "2026-09-18T00:00:00.000Z", updatedBy: "B", notes: "" },
  { id: 3, vendor: "Beta", region: "Da Nang", stage: "Contract Signed", stageEnteredAt: "2026-09-10T00:00:00.000Z", coordinator: "C", lastUpdated: "2026-09-10T00:00:00.000Z", updatedBy: "C", notes: "" },
];

describe("vendor business rules", () => {
  it("filters vendors by name and sorts alphabetically", () => {
    expect(filterAndSortVendors(vendors, "a", "name").map((vendor) => vendor.vendor)).toEqual(["Alpha", "Beta"]);
  });

  it("sorts vendors by the workflow stage order", () => {
    expect(filterAndSortVendors(vendors, "", "stage").map((vendor) => vendor.stage)).toEqual(["Contract Sent", "Contract Signed", "Active"]);
  });

  it("marks a vendor stuck only after seven full days", () => {
    const now = new Date("2026-09-19T00:00:00.000Z").getTime();
    expect(isVendorStuck({ ...vendors[1], stageEnteredAt: "2026-09-12T00:00:00.000Z" }, now)).toBe(false);
    expect(isVendorStuck({ ...vendors[1], stageEnteredAt: "2026-09-11T23:59:59.000Z" }, now)).toBe(true);
  });
});
