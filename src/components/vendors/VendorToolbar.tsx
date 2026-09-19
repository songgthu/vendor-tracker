import type { ChangeEvent } from "react";

type VendorToolbarProps = {
  query: string;
  sort: "name" | "stage";
  onQueryChange: (query: string) => void;
  onSortChange: (sort: "name" | "stage") => void;
};

export function VendorToolbar({ query, sort, onQueryChange, onSortChange }: VendorToolbarProps) {
  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value as "name" | "stage");
  };

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <input
        aria-label="Search vendors by name"
        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:max-w-xs"
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search vendors..."
        type="search"
        value={query}
      />
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        Sort by
        <select
          aria-label="Sort vendors"
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          onChange={handleSortChange}
          value={sort}
        >
          <option value="name">Vendor name (A-Z)</option>
          <option value="stage">Stage</option>
        </select>
      </label>
    </div>
  );
}
