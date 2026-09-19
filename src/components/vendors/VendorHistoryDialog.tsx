import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/vendors/logic";
import type { HistoryEntry, Vendor } from "@/lib/vendors/types";
import { PaginationControls } from "./PaginationControls";

type VendorHistoryDialogProps = {
  vendor: Vendor | null;
  entries: HistoryEntry[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onClose: () => void;
};

export function VendorHistoryDialog({ vendor, entries, loading, page, rowsPerPage, onPageChange, onRowsPerPageChange, onClose }: VendorHistoryDialogProps) {
  const pageCount = Math.max(1, Math.ceil(entries.length / rowsPerPage));
  const visibleEntries = entries.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  return <Dialog onOpenChange={(open) => !open && onClose()} open={vendor !== null}>
    <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
      <DialogHeader><DialogTitle>Update history</DialogTitle><DialogDescription>{vendor ? `Stage changes made to ${vendor.vendor}.` : ""}</DialogDescription></DialogHeader>
      {loading ? <p className="py-8 text-center text-muted-foreground">Loading history…</p> : <><Table><TableHeader><TableRow><TableHead>Updated At</TableHead><TableHead>Updated By</TableHead><TableHead>Stage</TableHead></TableRow></TableHeader><TableBody>{visibleEntries.length ? visibleEntries.map((entry) => <TableRow key={entry.id}><TableCell>{formatDate(entry.updatedAt)}</TableCell><TableCell>{entry.updatedBy}</TableCell><TableCell>{entry.changes.stage.from} → {entry.changes.stage.to}</TableCell></TableRow>) : <TableRow><TableCell className="py-8 text-center text-muted-foreground" colSpan={3}>No update history yet.</TableCell></TableRow>}</TableBody></Table>{entries.length > 0 && <PaginationControls itemLabel="updates" onPageChange={onPageChange} onRowsPerPageChange={onRowsPerPageChange} page={page} pageCount={pageCount} rowsPerPage={rowsPerPage} />}</>}
    </DialogContent>
  </Dialog>;
}
