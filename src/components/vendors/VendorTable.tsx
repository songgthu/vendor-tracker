import { TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { daysInStage, formatDate, isVendorStuck } from "@/lib/vendors/logic";
import type { Vendor } from "@/lib/vendors/types";

type VendorTableProps = {
  vendors: Vendor[];
  now: number;
  onUpdate: (vendor: Vendor) => void;
  onHistory: (vendor: Vendor) => void;
};

export function VendorTable({ vendors, now, onUpdate, onHistory }: VendorTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {['Vendor', 'Region', 'Stage', 'Coordinator', 'Last Updated', 'Updated By', 'Notes', ''].map((heading) => <TableHead key={heading}>{heading}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendors.length === 0 ? (
          <TableRow><TableCell className="py-8 text-center text-muted-foreground" colSpan={8}>No vendors match your search.</TableCell></TableRow>
        ) : vendors.map((vendor) => {
          const stuck = isVendorStuck(vendor, now);
          const days = daysInStage(vendor, now);
          return (
            <TableRow className={stuck ? "bg-amber-50 hover:bg-amber-100" : undefined} key={vendor.id}>
              <TableCell className="font-medium">{vendor.vendor}</TableCell>
              <TableCell>{vendor.region}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{vendor.stage}</Badge>
                  {stuck && <TooltipProvider><Tooltip><TooltipTrigger className="flex cursor-help items-center rounded-full"><TriangleAlert aria-label={`Stuck for ${days} days`} className="size-4 text-amber-600" /></TooltipTrigger><TooltipContent>Stuck for {days} days</TooltipContent></Tooltip></TooltipProvider>}
                </div>
              </TableCell>
              <TableCell>{vendor.coordinator}</TableCell>
              <TableCell>{formatDate(vendor.lastUpdated)}</TableCell>
              <TableCell>{vendor.updatedBy}</TableCell>
              <TableCell className="max-w-52 truncate">{vendor.notes || "—"}</TableCell>
              <TableCell><div className="flex gap-2"><Button onClick={() => onUpdate(vendor)} size="sm" variant="outline">Update</Button><Button onClick={() => onHistory(vendor)} size="sm" variant="ghost">History</Button></div></TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
