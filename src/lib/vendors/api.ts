import type { HistoryEntry, Stage, Vendor } from "./types";

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  return response.json() as Promise<T>;
}

export async function getVendors() {
  return request<Vendor[]>("/api/vendors");
}

export async function updateVendorStage(vendor: Vendor, stage: Stage, updatedBy: string) {
  const result = await request<{ vendor: Vendor }>("/api/vendors", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vendor: { ...vendor, stage, updatedBy } }),
  });
  return result.vendor;
}

export async function getVendorHistory(vendorId: number) {
  return request<HistoryEntry[]>(`/api/history?vendorId=${vendorId}`);
}
