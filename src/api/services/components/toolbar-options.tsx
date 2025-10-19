"use client";

// ** import core packages
import React from "react";

// ** import components
import BulkConfirmDialog from "./actions/bulk-confirm-dialog";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";

interface ToolbarOptionsProps {
  // Current page selected patients with name data
  selectedProducts: { id: string; name: string }[];
  // All selected patient IDs across all pages (for operations that only need IDs)
  allSelectedPatientIds?: (string | number)[];
  // Total count of selected items across all pages
  totalSelectedCount: number;
  resetSelection: () => void;
  onSuccess?: () => void;
}

export const ToolbarOptions = ({
  selectedProducts,
  allSelectedPatientIds = [],
  totalSelectedCount,
  resetSelection,
}: ToolbarOptionsProps) => {
  const [showStatusDialog, setShowStatusDialog] = React.useState(false);

  // Use total selected count if available, otherwise fall back to current page selection
  const selectionCount = totalSelectedCount || selectedProducts.length;

  // Determine which IDs to use for operations - prefer all selected IDs if available
  const selectedIds =
    allSelectedPatientIds.length > 0
      ? allSelectedPatientIds.map((id) => String(id))
      : selectedProducts.map((product) => product.id);

  const handleStatusChange = () => {
    setShowStatusDialog(true);
  };

  return (
    <div className="flex items-center gap-2">
      {selectionCount > 0 && (
        <React.Fragment>
          <Button variant={"secondary"} onClick={handleStatusChange}>
            <CircleCheck className="h-5 w-5 mr-2" /> Confirm
          </Button>

          {/* Bulk Confirm Dialog */}
          <BulkConfirmDialog
            open={showStatusDialog}
            selectedIds={selectedIds}
            onOpenChange={setShowStatusDialog}
          />
        </React.Fragment>
      )}
    </div>
  );
};
