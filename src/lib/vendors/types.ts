export const REGIONS = ["HCMC", "Hanoi", "Da Nang"] as const;

export type Region = (typeof REGIONS)[number];

export type Stage =
  | "Active"
  | "KYC Docs Received"
  | "Contract Signed"
  | "KYC Verified"
  | "Contract Sent";

export type Vendor = {
  id: number;
  vendor: string;
  region: Region;
  stage: Stage;
  stageEnteredAt: string;
  coordinator: string;
  lastUpdated: string;
  updatedBy: string;
  notes: string;
};

export type StageChange = {
  from: Stage;
  to: Stage;
};

export type HistoryEntry = {
  id: string;
  vendorId: number;
  updatedAt: string;
  updatedBy: string;
  changes: { stage: StageChange };
};

export type ApiError = Error & { status?: number };
