import { PAGE_SIZE_OPTIONS } from "@/lib/vendors/stages";
import { Button } from "@/components/ui/button";

type PaginationControlsProps = {
  page: number;
  pageCount: number;
  rowsPerPage: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
};

export function PaginationControls({
  page,
  pageCount,
  rowsPerPage,
  itemLabel,
  onPageChange,
  onRowsPerPageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
      <span>Page {page} of {pageCount}</span>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2">
          <span className="hidden sm:inline">Rows</span>
          <select
            aria-label={`${itemLabel} per page`}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-sm text-foreground"
            onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
            value={rowsPerPage}
          >
            {PAGE_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <Button disabled={page === 1} onClick={() => onPageChange(page - 1)} size="sm" variant="outline">Previous</Button>
        <Button disabled={page === pageCount} onClick={() => onPageChange(page + 1)} size="sm" variant="outline">Next</Button>
      </div>
    </div>
  );
}
