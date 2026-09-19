import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import type { HistoryEntry } from "@/lib/vendors/types";

const historyPath = path.join(process.cwd(), "src", "data", "history.json");

export async function GET(request: Request) {
  const vendorId = Number(new URL(request.url).searchParams.get("vendorId"));
  const history = JSON.parse(
    await readFile(historyPath, "utf8")
  ) as HistoryEntry[];

  const stageHistory = history
    .filter((entry) => entry.changes.stage)
    .map((entry) => ({
      ...entry,
      changes: { stage: entry.changes.stage },
    }));

  return NextResponse.json(
    Number.isFinite(vendorId)
      ? stageHistory.filter((entry) => entry.vendorId === vendorId)
      : stageHistory
  );
}
