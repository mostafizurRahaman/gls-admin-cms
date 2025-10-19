// ** import core packages
import React, { useState } from 'react';

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

// ** import api
import { bulkConfirmOrders } from '@/api/orders/bulk-confirm-orders';

// ** import utils
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';


interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];

}

const BulkConfirmDialog = ({
  open,
  onOpenChange,
  selectedIds,

}: DialogProps) => {
  const [isLoading, setIsLoading] = useState(false);


  const queryClient = useQueryClient();

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const response = await bulkConfirmOrders(selectedIds);

      if (response.success) {
        toast.success(response.message);

        // Show summary if available
        if (response.data.summary) {
          const { confirmed, skipped, totalRequested } = response.data.summary;
          if (skipped > 0) {
            toast.info(`${confirmed} orders confirmed, ${skipped} orders skipped`);

          } else {
            toast.success(`All ${confirmed} orders confirmed successfully`);
          }
        }

        if (response?.success) {
          console.log('invalidating new-orders, in-progress');
          // Invalidate new-orders queries
          queryClient.invalidateQueries({ queryKey: ['new-orders'] });
          // Invalidate in-progress-orders queries  
          queryClient.invalidateQueries({ queryKey: ['in-progress-orders'] });
        }

        onOpenChange(false);
      } else {
        toast.error(response.message || 'Failed to confirm orders');
      }
    } catch (error) {
      console.error('Bulk confirm failed:', error);
      toast.error('Failed to confirm orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-6">
        <DialogHeader>
          <DialogTitle>Bulk Confirm?</DialogTitle>
          <DialogDescription>
            Are you sure you want to confirm all selected orders?
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

export default BulkConfirmDialog;
