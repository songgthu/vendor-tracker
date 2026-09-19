"use client";

import type { FormEvent } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { VendorHistoryDialog } from "@/components/vendors/VendorHistoryDialog";
import { PaginationControls } from "@/components/vendors/PaginationControls";
import { VendorTable } from "@/components/vendors/VendorTable";
import { VendorToolbar } from "@/components/vendors/VendorToolbar";
import { VendorUpdateDialog } from "@/components/vendors/VendorUpdateDialog";
import { getVendorHistory, getVendors, updateVendorStage } from "@/lib/vendors/api";
import { filterAndSortVendors } from "@/lib/vendors/logic";
import type { HistoryEntry, Stage, Vendor } from "@/lib/vendors/types";

function subscribeToSession(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredUsername() {
  return sessionStorage.getItem("vendor-tracker-username");
}

export default function DashboardPage() {
  const router = useRouter();
  const storedUsername = useSyncExternalStore(subscribeToSession, getStoredUsername, () => null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const currentUser = isLoggedOut ? null : storedUsername;
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [vendorPage, setVendorPage] = useState(1);
  const [vendorRowsPerPage, setVendorRowsPerPage] = useState(10);
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorSort, setVendorSort] = useState<"name" | "stage">("name");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [saving, setSaving] = useState(false);
  const [historyVendor, setHistoryVendor] = useState<Vendor | null>(null);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyRowsPerPage, setHistoryRowsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) router.replace("/");
  }, [currentUser, router]);

  useEffect(() => {
    let cancelled = false;
    getVendors()
      .then((data) => { if (!cancelled) setVendors(data); })
      .catch(() => { if (!cancelled) setErrorMessage("Unable to load vendors. Please try again."); })
      .finally(() => { if (!cancelled) setVendorsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!successMessage && !errorMessage) return;
    const timer = window.setTimeout(() => { setSuccessMessage(null); setErrorMessage(null); }, 4000);
    return () => window.clearTimeout(timer);
  }, [successMessage, errorMessage]);

  const filteredVendors = filterAndSortVendors(vendors, vendorSearch, vendorSort);
  const vendorPageCount = Math.max(1, Math.ceil(filteredVendors.length / vendorRowsPerPage));
  const visibleVendors = filteredVendors.slice((vendorPage - 1) * vendorRowsPerPage, vendorPage * vendorRowsPerPage);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedVendor || !currentUser) return;
    setSaving(true);
    try {
      const updated = await updateVendorStage(selectedVendor, selectedVendor.stage, currentUser);
      setVendors((current) => current.map((vendor) => vendor.id === updated.id ? updated : vendor));
      setSelectedVendor(null);
      setSuccessMessage("Stage updated successfully.");
      setErrorMessage(null);
    } catch {
      setErrorMessage("Unable to update stage. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleOpenHistory(vendor: Vendor) {
    setHistoryVendor(vendor);
    setHistoryEntries([]);
    setHistoryPage(1);
    setHistoryLoading(true);
    try {
      setHistoryEntries(await getVendorHistory(vendor.id));
    } catch {
      setHistoryVendor(null);
      setErrorMessage("Unable to load update history. Please try again.");
    } finally {
      setHistoryLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("vendor-tracker-username");
    setIsLoggedOut(true);
  }

  function handleStageChange(stage: Stage) {
    setSelectedVendor((current) => current ? { ...current, stage } : current);
  }

  if (!currentUser) return null;

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div><h1 className="text-2xl font-medium tracking-tight">Vendor tracking</h1><p className="mt-1 text-sm text-muted-foreground">Track vendor onboarding progress and updates.</p></div>
          <div className="relative shrink-0"><Button onClick={() => setAccountMenuOpen((open) => !open)} variant="ghost">Logged in as {currentUser}</Button>{accountMenuOpen && <div className="absolute right-0 top-full z-10 mt-2 rounded-lg bg-popover p-1 shadow-md ring-1 ring-foreground/10"><Button onClick={handleLogout} variant="ghost">Log out</Button></div>}</div>
        </header>

        {successMessage && <Alert className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-900"><AlertDescription>{successMessage}</AlertDescription></Alert>}
        {errorMessage && <Alert className="mb-6" variant="destructive"><AlertDescription>{errorMessage}</AlertDescription></Alert>}

        <VendorToolbar query={vendorSearch} sort={vendorSort} onQueryChange={(query) => { setVendorSearch(query); setVendorPage(1); }} onSortChange={(sort) => { setVendorSort(sort); setVendorPage(1); }} />
        <section className="rounded-xl bg-card ring-1 ring-foreground/10">
          {vendorsLoading ? <p className="py-12 text-center text-muted-foreground">Loading vendors…</p> : <><VendorTable now={now} onHistory={handleOpenHistory} onUpdate={setSelectedVendor} vendors={visibleVendors} /><PaginationControls itemLabel="vendors" onPageChange={setVendorPage} onRowsPerPageChange={(rows) => { setVendorRowsPerPage(rows); setVendorPage(1); }} page={vendorPage} pageCount={vendorPageCount} rowsPerPage={vendorRowsPerPage} /></>}
        </section>
      </div>

      <VendorUpdateDialog onClose={() => setSelectedVendor(null)} onStageChange={handleStageChange} onSubmit={handleUpdate} saving={saving} vendor={selectedVendor} />
      <VendorHistoryDialog entries={historyEntries} loading={historyLoading} onClose={() => setHistoryVendor(null)} onPageChange={setHistoryPage} onRowsPerPageChange={(rows) => { setHistoryRowsPerPage(rows); setHistoryPage(1); }} page={historyPage} rowsPerPage={historyRowsPerPage} vendor={historyVendor} />
    </main>
  );
}
