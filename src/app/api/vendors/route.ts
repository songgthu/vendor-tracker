import { readFile, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import type { HistoryEntry, Vendor } from "@/lib/vendors/types";
import { STAGES } from "@/lib/vendors/stages";

const dataDirectory = path.join(process.cwd(), "src", "data");
const vendorsPath = path.join(dataDirectory, "vendors.json");
const historyPath = path.join(dataDirectory, "history.json");

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

export async function GET() {
  return NextResponse.json(await readJson<Vendor[]>(vendorsPath));
}

export async function PUT(request: Request) {
  const { vendor: updatedVendor } = (await request.json()) as { vendor: Vendor };

  if (!updatedVendor?.id) {
    return NextResponse.json({ error: "Vendor is required." }, { status: 400 });
  }

  if (!STAGES.includes(updatedVendor.stage)) {
    return NextResponse.json({ error: "Invalid stage." }, { status: 400 });
  }

  const vendors = await readJson<Vendor[]>(vendorsPath);
  const vendorIndex = vendors.findIndex((vendor) => vendor.id === updatedVendor.id);

  if (vendorIndex === -1) {
    return NextResponse.json({ error: "Vendor not found." }, { status: 404 });
  }

  const previousVendor = vendors[vendorIndex];
  const stageChanged = previousVendor.stage !== updatedVendor.stage;
  const updatedAt = new Date().toISOString();
  const persistedVendor: Vendor = {
    ...previousVendor,
    stage: updatedVendor.stage,
    lastUpdated: updatedAt,
    updatedBy: updatedVendor.updatedBy,
    stageEnteredAt: stageChanged ? updatedAt : previousVendor.stageEnteredAt,
  };
  const changes = stageChanged
    ? { stage: { from: previousVendor.stage, to: persistedVendor.stage } }
    : null;

  vendors[vendorIndex] = persistedVendor;
  await writeFile(vendorsPath, `${JSON.stringify(vendors, null, 2)}\n`);

  if (changes) {
    const history = await readJson<HistoryEntry[]>(historyPath);
    history.unshift({
      id: crypto.randomUUID(),
      vendorId: persistedVendor.id,
      updatedAt: persistedVendor.lastUpdated,
      updatedBy: persistedVendor.updatedBy,
      changes,
    });
    await writeFile(historyPath, `${JSON.stringify(history, null, 2)}\n`);
  }

  return NextResponse.json({ vendor: persistedVendor });
}
