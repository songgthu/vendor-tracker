import type { Stage } from "./types";

export const STAGES: readonly Stage[] = [
  "Contract Sent",
  "Contract Signed",
  "KYC Docs Received",
  "KYC Verified",
  "Active",
];

export const STUCK_THRESHOLD_DAYS = 7;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export function stageIndex(stage: Stage) {
  return STAGES.indexOf(stage);
}
