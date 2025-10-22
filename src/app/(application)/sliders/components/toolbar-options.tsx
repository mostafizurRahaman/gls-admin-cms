// src/app/(application)/sliders/components/toolbar-options.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Typography } from "@/components/typography";
import CreateSliderDialog from "./actions/create-slider-dialog";
import BulkDeleteSlidersDialog from "./actions/bulk-delete-sliders-dialog";

interface ToolbarOptionsProps {
  selectedSliders: { id: number; title: string }[];
  allSelectedSliderIds?: (string | number)[];
  totalSelectedCount: number;
  resetSelection: () => void;
  onSuccess?: () => void;
}

export const ToolbarOptions = ({
  selectedSliders,
  allSelectedSliderIds = [],
  totalSelectedCount,
  resetSelection,
  onSuccess,
}: ToolbarOptionsProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const hasSelection = totalSelectedCount > 0;

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Show bulk actions when items are selected */}
        {hasSelection ? (
          <>
            <Typography variant="Regular_H6" className="text-muted-foreground">
              {totalSelectedCount} selected
            </Typography>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowBulkDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <Typography variant="Medium_H6">Delete Selected</Typography>
            </Button>
            <Button variant="outline" size="sm" onClick={resetSelection}>
              <Typography variant="Medium_H6">Clear Selection</Typography>
            </Button>
          </>
        ) : (
          // Show create button when no selection
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            <Typography variant="Medium_H6">Add Slider</Typography>
          </Button>
        )}
      </div>

      {/* Create Dialog */}
      <CreateSliderDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={onSuccess}
      />

      {/* Bulk Delete Dialog */}
      <BulkDeleteSlidersDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        selectedSliderIds={selectedSliders.map((s) => s.id)}
        selectedCount={totalSelectedCount}
        resetSelection={resetSelection}
        onSuccess={onSuccess}
      />
    </>
  );
};
