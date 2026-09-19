import { beforeEach, describe, expect, it, vi } from "vitest";
import path from "node:path";

const files = new Map<string, string>();
const vendorsPath = path.join(process.cwd(), "src", "data", "vendors.json");
const historyPath = path.join(process.cwd(), "src", "data", "history.json");

vi.mock("fs/promises", () => ({
  readFile: vi.fn(async (filePath: string) => files.get(filePath) ?? "[]"),
  writeFile: vi.fn(async (filePath: string, contents: string) => { files.set(filePath, contents); }),
}));

describe("vendor API", () => {
  beforeEach(() => {
    files.clear();
    files.set(vendorsPath, JSON.stringify([{
      id: 1, vendor: "Company A", region: "HCMC", stage: "Contract Sent", stageEnteredAt: "2026-09-01T00:00:00.000Z", coordinator: "A", lastUpdated: "2026-09-01T00:00:00.000Z", updatedBy: "A", notes: "",
    }]));
    files.set(historyPath, "[]");
  });

  it("persists only a stage transition and writes its history entry", async () => {
    const { PUT } = await import("@/app/api/vendors/route");
    const response = await PUT(new Request("http://localhost/api/vendors", {
      method: "PUT",
      body: JSON.stringify({ vendor: { id: 1, stage: "Active", updatedBy: "coordinator" } }),
    }));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.vendor.stage).toBe("Active");
    expect(body.vendor.stageEnteredAt).not.toBe("2026-09-01T00:00:00.000Z");
    const history = JSON.parse(files.get(historyPath) ?? "[]");
    expect(history[0].changes).toEqual({ stage: { from: "Contract Sent", to: "Active" } });
    expect(history[0].changes.stageEnteredAt).toBeUndefined();
  });
});
