// ** import core packages
import React from 'react';

// ** import components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  onDelete: () => void;
  isLoading?: boolean;
}

const ConfirmOrderDialog = ({
  open,
  onOpenChange,
  id,
  onDelete,
  isLoading = false,
}: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-6">
        <DialogHeader>
          <DialogTitle>Confirm Order?</DialogTitle>
          <DialogDescription>
            Are you sure you want to confirm this{' '}
            <span className="text-primary font-medium">"{id}"</span> order?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant={'secondary'}
            onClick={onDelete}
            type="button"
            disabled={isLoading}
            loading={isLoading}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmOrderDialog;
