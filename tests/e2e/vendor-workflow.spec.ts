import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";

const vendorsPath = "src/data/vendors.json";
const historyPath = "src/data/history.json";
let originalVendors: string;
let originalHistory: string;

test.beforeAll(async () => {
  originalVendors = await fs.readFile(vendorsPath, "utf8");
  originalHistory = await fs.readFile(historyPath, "utf8");
});

test.afterAll(async () => {
  await fs.writeFile(vendorsPath, originalVendors);
  await fs.writeFile(historyPath, originalHistory);
});

test("coordinator can identify, inspect, progress, and verify a vendor", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Username").fill("e2e-coordinator");
  await page.getByLabel("Password").fill("test-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Vendor tracking" })).toBeVisible();

  const vendorRow = page.getByRole("row").filter({ hasText: "Company C" });
  await expect(vendorRow.getByLabel(/Stuck for \d+ days/)).toBeVisible();

  await vendorRow.getByRole("button", { name: "History" }).click();
  await expect(page.getByRole("dialog")).toContainText("Stage changes made to Company C");
  await page.keyboard.press("Escape");

  await vendorRow.getByRole("button", { name: "Update" }).click();
  const updateDialog = page.getByRole("dialog");
  await updateDialog.getByLabel("Stage").selectOption("Contract Sent");
  await updateDialog.getByRole("button", { name: "Update" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Stage updated successfully" })).toBeVisible();
  await expect(vendorRow).toContainText("Contract Sent");

  await vendorRow.getByRole("button", { name: "History" }).click();
  await expect(page.getByRole("dialog")).toContainText("Contract Signed → Contract Sent");
  await expect(page.getByRole("dialog")).toContainText("e2e-coordinator");
});
