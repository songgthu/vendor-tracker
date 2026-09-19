import { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { STAGES } from "@/lib/vendors/stages";
import type { Stage, Vendor } from "@/lib/vendors/types";
import { formatDate } from "@/lib/vendors/logic";

type VendorUpdateDialogProps = {
  vendor: Vendor | null;
  saving: boolean;
  onStageChange: (stage: Stage) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export function VendorUpdateDialog({ vendor, saving, onStageChange, onSubmit, onClose }: VendorUpdateDialogProps) {
  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open={vendor !== null}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>Update vendor</DialogTitle><DialogDescription>Only the current stage can be changed.</DialogDescription></DialogHeader>
        {vendor && <form className="grid gap-4" onSubmit={onSubmit}>
          <LockedField id="vendor" label="Vendor" value={vendor.vendor} />
          <LockedField id="region" label="Region" value={vendor.region} />
          <div className="grid gap-2"><Label htmlFor="stage">Stage</Label><select className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm" id="stage" onChange={(event) => onStageChange(event.target.value as Stage)} required value={vendor.stage}>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select></div>
          <LockedField id="coordinator" label="Coordinator" value={vendor.coordinator} />
          <div className="grid gap-2"><Label htmlFor="notes">Notes</Label><textarea className="min-h-20 rounded-lg border border-input bg-muted px-3 py-2 text-sm" disabled id="notes" value={vendor.notes} /></div>
          <div className="grid gap-1 rounded-lg bg-muted/50 p-3 text-sm"><span className="text-muted-foreground">Last updated</span><span>{formatDate(vendor.lastUpdated)}</span><span className="mt-2 text-muted-foreground">Updated by</span><span>{vendor.updatedBy}</span></div>
          <DialogFooter><Button onClick={onClose} type="button" variant="outline">Cancel</Button><Button disabled={saving} type="submit">{saving ? "Updating…" : "Update"}</Button></DialogFooter>
        </form>}
      </DialogContent>
    </Dialog>
  );
}

function LockedField({ id, label, value }: { id: string; label: string; value: string }) {
  return <div className="grid gap-2"><Label htmlFor={id}>{label}</Label><input className="h-10 rounded-lg border border-input bg-muted px-3 text-sm" disabled id={id} value={value} /></div>;
}
